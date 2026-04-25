const express = require('express');
const cors    = require('cors');
const axios   = require('axios');
const PDFDocument = require('pdfkit');

const schemes   = require('./data/schemes');
const hospitals = require('./data/hospitals');
const { matchSchemes, matchHospitals } = require('./utils/matcher');

const app  = express();
const PORT = 5000;
const NLP_URL = 'http://localhost:5001/nlp/detect';

app.use(cors());
app.use(express.json());

/* ── HELPERS ─────────────────────────────────────── */

// Regex fallback condition detection (used if NLP service is down)
const CONDITION_REGEX = {
  kidney_disease: /kidney|dialysis|renal|hemodialysis|nephro/i,
  cancer:         /cancer|tumor|oncology|chemotherapy|carcinoma/i,
  heart_disease:  /heart|cardiac|bypass|angioplasty|cardio/i,
  diabetes:       /diabetes|diabetic|insulin|blood sugar|glucose/i,
  tuberculosis:   /tb|tuberculosis|cough|sputum|pulmonary/i,
  maternity:      /pregnant|pregnancy|delivery|prenatal|labour|जननी/i,
  child_health:   /child|infant|baby|vaccination|immunization|pediatric/i,
  mental_health:  /depression|anxiety|mental|psychiatric|stress/i,
  eye_disease:    /eye|cataract|glaucoma|vision|blindness/i,
  trauma:         /accident|injury|fracture|trauma|emergency/i,
};

function regexDetect(query) {
  return Object.entries(CONDITION_REGEX)
    .filter(([, rx]) => rx.test(query))
    .map(([cond]) => cond);
}

async function detectConditions(query) {
  try {
    const res = await axios.post(NLP_URL, { text: query }, { timeout: 3000 });
    return res.data.conditions || [];
  } catch {
    // NLP service unavailable — graceful fallback
    console.log('[NLP] Service unavailable, using regex fallback');
    return regexDetect(query);
  }
}

// Nominatim geocode
async function geocodePincode(pincode) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json&limit=1`;
    const res = await axios.get(url, {
      headers: { 'User-Agent': 'MedBridge/1.0 (hackathon)' },
      timeout: 4000,
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

/* ── MAIN SEARCH ENDPOINT ─────────────────────────── */
app.post('/api/search', async (req, res) => {
  const { query = '', state = 'Delhi', bpl = false, income, pincode, lang = 'en' } = req.body;

  if (!query.trim()) return res.status(400).json({ error: 'query is required' });

  // 1. NLP condition detection
  const conditions = await detectConditions(query);
  const primaryCondition = conditions[0] || 'general';

  // 2. Scheme matching
  const matchedSchemes = matchSchemes({ conditions, state, bpl, income })
    .map(s => ({ ...s, matched_condition: primaryCondition }));

  // 3. Hospital matching + distance sort
  let coords = null;
  let location_resolved = false;

  if (pincode) {
    coords = await geocodePincode(pincode);
    if (coords) location_resolved = true;
  }

  let matchedHospitals = matchHospitals({ conditions, state });

  if (coords) {
    matchedHospitals = matchedHospitals
      .map(h => ({
        ...h,
        distance_km: haversine(coords.lat, coords.lng, h.lat, h.lng),
      }))
      .sort((a, b) => a.distance_km - b.distance_km);
  }

  return res.json({
    conditions,
    schemes: matchedSchemes,
    hospitals: matchedHospitals.slice(0, 8),
    meta: {
      query,
      state,
      bpl,
      location_resolved,
      coords,
    },
  });
});

/* ── PDF GENERATION ENDPOINT ──────────────────────────────── */
app.post('/api/pdf', (req, res) => {
  const { query, conditions, schemes, hospitals, state } = req.body;

  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=MedBridge-Results.pdf');
  doc.pipe(res);

  // Header
  doc.rect(0, 0, doc.page.width, 80).fill('#1a73e8');
  doc.fillColor('#ffffff').fontSize(24).font('Helvetica-Bold')
     .text('🏥 MedBridge', 50, 25);
  doc.fontSize(11).font('Helvetica')
     .text('Free Government Healthcare Scheme Finder', 50, 52);
  doc.fillColor('#000000');

  doc.moveDown(3);

  // Query summary
  doc.fontSize(13).font('Helvetica-Bold').fillColor('#1a1a2e')
     .text('Search Summary', 50, 100);
  doc.fontSize(11).font('Helvetica').fillColor('#444444')
     .text(`Query: ${query}`, 50, 120)
     .text(`State: ${state || 'N/A'}`, 50, 138)
     .text(`Conditions Detected: ${conditions?.join(', ') || 'General'}`, 50, 156)
     .text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 50, 174);

  doc.moveTo(50, 196).lineTo(545, 196).strokeColor('#e0e0e0').stroke();

  // Schemes
  doc.moveDown(0.5);
  doc.fontSize(14).font('Helvetica-Bold').fillColor('#1a73e8')
     .text('Matched Government Schemes', 50, 210);

  let y = 235;
  (schemes || []).forEach((s, i) => {
    if (y > 700) { doc.addPage(); y = 50; }

    doc.rect(50, y, 495, 4).fill(i === 0 ? '#f57c00' : '#1a73e8');
    y += 10;

    doc.fontSize(12).font('Helvetica-Bold').fillColor('#1a1a2e')
       .text(`${i + 1}. ${s.name_en}`, 50, y);
    y += 18;

    doc.fontSize(10).font('Helvetica').fillColor('#555555')
       .text(s.description_en, 50, y, { width: 495, lineGap: 3 });
    y += doc.heightOfString(s.description_en, { width: 495 }) + 6;

    if (s.bpl_required) {
      doc.fontSize(9).fillColor('#c62828').text('✓ BPL Required', 50, y);
      y += 14;
    }
    if (s.income_limit) {
      doc.fontSize(9).fillColor('#2e7d32')
         .text(`✓ Income Limit: ₹${Number(s.income_limit).toLocaleString('en-IN')}`, 50, y);
      y += 14;
    }

    doc.fontSize(9).font('Helvetica-Bold').fillColor('#1a1a2e').text('Documents Required:', 50, y);
    y += 13;
    (s.documents || []).forEach(d => {
      doc.fontSize(9).font('Helvetica').fillColor('#444444').text(`  • ${d}`, 50, y);
      y += 13;
    });

    doc.fontSize(9).fillColor('#666666').font('Helvetica-Oblique')
       .text(`Apply at: ${s.apply_at}`, 50, y);
    y += 22;

    doc.moveTo(50, y).lineTo(545, y).strokeColor('#f0f0f0').stroke();
    y += 14;
  });

  // Hospitals
  if ((hospitals || []).length > 0) {
    if (y > 650) { doc.addPage(); y = 50; }
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#34a853')
       .text('Nearby Hospitals', 50, y);
    y += 24;

    hospitals.forEach((h, i) => {
      if (y > 700) { doc.addPage(); y = 50; }

      doc.fontSize(11).font('Helvetica-Bold').fillColor('#1a1a2e')
         .text(`${i + 1}. ${h.name}`, 50, y);
      y += 16;

      doc.fontSize(9).font('Helvetica').fillColor('#555555')
         .text(`📍 ${h.city}, ${h.state}  |  🕐 ${h.timings}  |  📞 ${h.phone}`, 50, y);
      y += 13;

      if (h.distance_km !== undefined) {
        doc.fontSize(9).fillColor('#34a853').text(`Distance: ${h.distance_km} km`, 50, y);
        y += 13;
      }
      y += 8;
    });
  }

  // Footer
  const pageCount = doc.bufferedPageRange().count;
  for (let i = 0; i < pageCount; i++) {
    doc.switchToPage(i);
    doc.fontSize(8).fillColor('#aaaaaa').font('Helvetica')
       .text('MedBridge — Free Government Healthcare Discovery | Data from official government portals',
             50, doc.page.height - 35, { align: 'center', width: 495 });
  }

  doc.end();
});

/* ── LOCATE ENDPOINT ──────────────────────────────────────── */
app.get('/api/locate', async (req, res) => {
  const { pincode } = req.query;
  if (!pincode) return res.status(400).json({ error: 'pincode required' });
  const coords = await geocodePincode(pincode);
  if (!coords) return res.status(404).json({ error: 'Could not resolve pincode' });
  return res.json(coords);
});

app.listen(PORT, () => {
  console.log(`MedBridge server running on http://localhost:${PORT}`);
});
