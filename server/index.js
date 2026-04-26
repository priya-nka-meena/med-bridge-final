const express = require('express');
const cors    = require('cors');
const axios   = require('axios');
const PDFDocument = require('pdfkit');
const path    = require('path');

const { matchSchemes, matchHospitals } = require('./utils/matcher');

const app  = express();
const PORT = 5000;
const NLP_URL = 'http://localhost:5001/nlp/detect';

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

// ── REGEX FALLBACK ──────────────────────────────────────────────────────────
const CONDITION_REGEX = {
  kidney_disease: /kidney|dialysis|renal|hemodialysis|nephro|creatinine|गुर्दा|किडनी/i,
  cancer:         /cancer|tumor|oncology|chemotherapy|carcinoma|कैंसर/i,
  heart_disease:  /heart|cardiac|bypass|angioplasty|cardio|दिल|हृदय/i,
  diabetes:       /diabetes|diabetic|insulin|blood sugar|glucose|मधुमेह|शुगर/i,
  tuberculosis:   /\btb\b|tuberculosis|cough|sputum|pulmonary|टीबी|खांसी/i,
  maternity:      /pregnant|pregnancy|delivery|prenatal|labour|जननी|गर्भवती|प्रसव/i,
  child_health:   /child|infant|baby|vaccination|immunization|pediatric|बच्चा|शिशु/i,
  mental_health:  /depression|anxiety|mental|psychiatric|stress|अवसाद|मानसिक/i,
  eye_disease:    /\beye\b|cataract|glaucoma|vision|blindness|आँख|मोतियाबिंद/i,
  trauma:         /accident|injury|fracture|trauma|emergency|दुर्घटना|चोट/i,
};

function regexDetect(query) {
  return Object.entries(CONDITION_REGEX)
    .filter(([, rx]) => rx.test(query))
    .map(([cond]) => cond);
}

async function detectConditions(query) {
  try {
    const res = await axios.post(NLP_URL, { text: query }, { timeout: 3000 });
    const conditions = res.data.conditions || [];
    return conditions.length > 0 ? conditions : regexDetect(query);
  } catch {
    console.log('[NLP] Fallback to regex');
    return regexDetect(query);
  }
}

async function geocodePincode(pincode) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json&limit=1`;
    const res = await axios.get(url, {
      headers: { 'User-Agent': 'MedBridge/2.0 (hackathon project)' },
      timeout: 5000,
    });
    if (res.data && res.data.length > 0) {
      return { lat: parseFloat(res.data[0].lat), lng: parseFloat(res.data[0].lon) };
    }
  } catch { /* ignore */ }
  return null;
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return +(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1);
}

// ── MAIN SEARCH ─────────────────────────────────────────────────────────────
app.post('/api/search', async (req, res) => {
  const { query = '', state = 'Delhi', bpl = false, income, pincode, lang = 'en', age } = req.body;
  if (!query.trim()) return res.status(400).json({ error: 'query is required' });

  const conditions = await detectConditions(query);
  const primaryCondition = conditions[0] || 'general';

  const matchedSchemes = matchSchemes({ conditions, state, bpl, income, age });

  let coords = null;
  let location_resolved = false;
  if (pincode) {
    coords = await geocodePincode(pincode);
    if (coords) location_resolved = true;
  }

  let matchedHospitals = matchHospitals({ conditions, state });
  if (coords) {
    matchedHospitals = matchedHospitals
      .map(h => ({ ...h, distance_km: haversine(coords.lat, coords.lng, h.lat, h.lng) }))
      .sort((a, b) => a.distance_km - b.distance_km);
  }

  return res.json({
    conditions,
    schemes: matchedSchemes.slice(0, 10),
    hospitals: matchedHospitals.slice(0, 8),
    meta: { query, state, bpl, location_resolved, coords, age },
  });
});

// ── PDF GENERATION ───────────────────────────────────────────────────────────
app.post('/api/pdf', async (req, res) => {
  try {
    const { query, conditions, schemes, hospitals, state, age } = req.body;

    const doc = new PDFDocument({
      margin: 50,
      size: 'A4',
      bufferPages: true,
      info: { Title: 'MedBridge Results', Author: 'MedBridge' }
    });

    // Buffer all content into memory
    const buffers = [];
    doc.on('data', chunk => buffers.push(chunk));

    await new Promise((resolve, reject) => {
      doc.on('end', resolve);
      doc.on('error', reject);

      // ── HEADER ──
      doc.rect(0, 0, doc.page.width, 90).fill('#1A73E8');
      doc.fillColor('#FFFFFF')
        .font('Helvetica-Bold').fontSize(26)
        .text('MedBridge', 50, 22);
      doc.font('Helvetica').fontSize(11)
        .text('Free Government Healthcare Scheme Finder', 50, 52);
      doc.font('Helvetica').fontSize(10).fillColor('#B3D4FF')
        .text('pmjay.gov.in  |  nhm.gov.in  |  india.gov.in', 50, 68);

      doc.moveDown(4);

      // ── SEARCH SUMMARY ──
      const summaryY = 105;
      doc.rect(50, summaryY, doc.page.width - 100, 80).fill('#F8F9FA').stroke('#E0E0E0');
      doc.fillColor('#1A1A2E').font('Helvetica-Bold').fontSize(13)
        .text('Search Summary', 66, summaryY + 10);
      doc.font('Helvetica').fontSize(10).fillColor('#444444')
        .text(`Query: ${query}`, 66, summaryY + 28)
        .text(`State: ${state || 'N/A'}  |  Age: ${age || 'Not specified'}  |  Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, 66, summaryY + 44)
        .text(`Conditions Detected: ${(conditions || []).join(', ').replace(/_/g, ' ') || 'General'}`, 66, summaryY + 60);

      let y = summaryY + 100;

      // ── SCHEMES ──
      doc.fillColor('#1A73E8').font('Helvetica-Bold').fontSize(15)
        .text('Matched Government Schemes', 50, y);
      y += 24;

      (schemes || []).slice(0, 8).forEach((s, i) => {
        if (y > 680) { doc.addPage(); y = 50; }

        // Scheme header bar
        const barColor = i === 0 ? '#F57C00' : '#1A73E8';
        doc.rect(50, y, doc.page.width - 100, 3).fill(barColor);
        y += 8;

        doc.fillColor('#1A1A2E').font('Helvetica-Bold').fontSize(12)
          .text(`${i + 1}. ${s.name_en}`, 50, y, { width: doc.page.width - 110 });
        y += 18;

        if (s.benefit_amount) {
          doc.rect(50, y, 200, 16).fill('#E8F5E9');
          doc.fillColor('#2D8F47').font('Helvetica-Bold').fontSize(9)
            .text(`Benefit: ${s.benefit_amount}`, 56, y + 3, { width: 194 });
          y += 20;
        }

        doc.fillColor('#555555').font('Helvetica').fontSize(9)
          .text(s.description_en, 50, y, { width: doc.page.width - 100, lineGap: 2 });
        const descHeight = doc.heightOfString(s.description_en, { width: doc.page.width - 100, lineGap: 2 });
        y += descHeight + 6;

        if (s.bpl_required) {
          doc.fillColor('#C62828').font('Helvetica-Bold').fontSize(8).text('✔ BPL Required', 50, y); y += 13;
        }
        if (s.income_limit) {
          doc.fillColor('#2D8F47').font('Helvetica-Bold').fontSize(8).text(`✔ Income Limit: ₹${Number(s.income_limit).toLocaleString('en-IN')}`, 50, y); y += 13;
        }

        doc.fillColor('#1A1A2E').font('Helvetica-Bold').fontSize(9).text('Documents Required:', 50, y); y += 12;
        (s.documents || []).forEach(d => {
          doc.fillColor('#444444').font('Helvetica').fontSize(9).text(`  • ${d}`, 50, y, { width: doc.page.width - 100 });
          y += 12;
        });

        doc.fillColor('#666666').font('Helvetica-Oblique').fontSize(8)
          .text(`Apply at: ${s.apply_at}`, 50, y, { width: doc.page.width - 100 });
        y += 20;

        doc.moveTo(50, y).lineTo(doc.page.width - 50, y).strokeColor('#EEEEEE').lineWidth(0.5).stroke();
        y += 12;
      });

      // ── HOSPITALS ──
      if ((hospitals || []).length > 0) {
        if (y > 650) { doc.addPage(); y = 50; }
        doc.fillColor('#34A853').font('Helvetica-Bold').fontSize(15)
          .text('Nearby Government Hospitals', 50, y);
        y += 24;

        hospitals.forEach((h, i) => {
          if (y > 700) { doc.addPage(); y = 50; }
          doc.fillColor('#1A1A2E').font('Helvetica-Bold').fontSize(11)
            .text(`${i + 1}. ${h.name}`, 50, y, { width: doc.page.width - 100 });
          y += 16;
          doc.fillColor('#555555').font('Helvetica').fontSize(9)
            .text(`📍 ${h.city}, ${h.state}   🕐 ${h.timings}   📞 ${h.phone}`, 50, y, { width: doc.page.width - 100 });
          y += 13;
          if (h.distance_km !== undefined) {
            doc.fillColor('#34A853').font('Helvetica-Bold').fontSize(9)
              .text(`Distance: ${h.distance_km} km`, 50, y);
            y += 13;
          }
          const mapsUrl = `https://maps.google.com/maps?q=${h.lat},${h.lng}`;
          doc.fillColor('#1A73E8').font('Helvetica').fontSize(8)
            .text(`Google Maps: ${mapsUrl}`, 50, y, { link: mapsUrl, underline: true, width: doc.page.width - 100 });
          y += 20;
        });
      }

      // ── FOOTER on all pages ──
      const range = doc.bufferedPageRange();
      for (let i = 0; i < range.count; i++) {
        doc.switchToPage(range.start + i);
        const footerY = doc.page.height - 40;
        doc.rect(0, footerY - 5, doc.page.width, 45).fill('#F5F5F5');
        doc.fillColor('#999999').font('Helvetica').fontSize(8)
          .text(
            `MedBridge — Free Government Healthcare Discovery  |  Data from nhm.gov.in, pmjay.gov.in, india.gov.in  |  Page ${i + 1} of ${range.count}`,
            50, footerY + 2, { align: 'center', width: doc.page.width - 100 }
          );
      }

      doc.end();
    });

    const pdfBuffer = Buffer.concat(buffers);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="MedBridge-Results.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.end(pdfBuffer);

  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ error: 'PDF generation failed', details: err.message });
  }
});

// ── LOCATE ──────────────────────────────────────────────────────────────────
app.get('/api/locate', async (req, res) => {
  const { pincode } = req.query;
  if (!pincode) return res.status(400).json({ error: 'pincode required' });
  const coords = await geocodePincode(pincode);
  if (!coords) return res.status(404).json({ error: 'Could not resolve pincode' });
  return res.json(coords);
});

// ── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ MedBridge server running on http://localhost:${PORT}`);
});
