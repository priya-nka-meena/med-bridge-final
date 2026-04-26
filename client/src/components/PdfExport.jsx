import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function PdfExport({ scheme, hospital, condition, query }) {
  const [generating, setGenerating] = useState(false);

  function generate() {
    if (!scheme) {
      alert('Please select a scheme first to download its PDF.');
      return;
    }
    setGenerating(true);
    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const W = doc.internal.pageSize.getWidth();

      // Header banner
      doc.setFillColor(26, 115, 232);
      doc.rect(0, 0, W, 28, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('MedBridge', 14, 12);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Free Government Healthcare Scheme Report', 14, 20);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, W - 14, 20, { align: 'right' });

      let y = 36;

      // Patient query
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Health Problem Described:', 14, y);
      doc.setFont('helvetica', 'normal');
      const queryLines = doc.splitTextToSize(query || 'N/A', W - 28);
      doc.text(queryLines, 14, y + 6);
      y += 6 + queryLines.length * 5 + 4;

      if (condition) {
        doc.setFont('helvetica', 'bold');
        doc.text('Detected Condition:', 14, y);
        doc.setFont('helvetica', 'normal');
        doc.text(condition, 60, y);
        y += 10;
      }

      doc.setDrawColor(220, 220, 220);
      doc.line(14, y, W - 14, y);
      y += 6;

      // Scheme section header
      doc.setFillColor(232, 240, 254);
      doc.rect(14, y, W - 28, 8, 'F');
      doc.setTextColor(26, 115, 232);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Selected Government Scheme', 16, y + 5.5);
      y += 12;

      doc.setTextColor(20, 20, 20);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text(scheme.name_en, 14, y);
      y += 7;

      if (scheme.bpl_required) {
        doc.setFontSize(9);
        doc.setTextColor(198, 40, 40);
        doc.setFont('helvetica', 'bold');
        doc.text('BPL Card Required', 14, y);
        y += 6;
      }
      if (scheme.income_limit) {
        doc.setFontSize(9);
        doc.setTextColor(46, 125, 50);
        doc.setFont('helvetica', 'bold');
        doc.text(`Income Limit: Up to Rs ${Number(scheme.income_limit).toLocaleString('en-IN')}`, 14, y);
        y += 6;
      }

      doc.setTextColor(60, 60, 60);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(scheme.description_en || '', W - 28);
      doc.text(descLines, 14, y);
      y += descLines.length * 5 + 6;

      // Documents table
      doc.setDrawColor(220, 220, 220);
      doc.line(14, y, W - 14, y);
      y += 5;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(20, 20, 20);
      doc.text('Required Documents', 14, y);
      y += 5;

      autoTable(doc, {
        startY: y,
        head: [['#', 'Document Required']],
        body: (scheme.documents || []).map((d, i) => [i + 1, d]),
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [26, 115, 232], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 248, 255] },
        margin: { left: 14, right: 14 },
      });
      y = doc.lastAutoTable.finalY + 8;

      // Apply at
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(26, 115, 232);
      doc.text('Where to Apply:', 14, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      const applyLines = doc.splitTextToSize(scheme.apply_at || 'Nearest government hospital', W - 28);
      doc.text(applyLines, 14, y + 6);
      y += applyLines.length * 5 + 10;

      // Hospital section
      if (hospital) {
        if (y > 230) { doc.addPage(); y = 20; }
        doc.setDrawColor(220, 220, 220);
        doc.line(14, y, W - 14, y);
        y += 5;
        doc.setFillColor(232, 245, 233);
        doc.rect(14, y, W - 28, 8, 'F');
        doc.setTextColor(46, 125, 50);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Selected Hospital', 16, y + 5.5);
        y += 12;

        doc.setTextColor(20, 20, 20);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(hospital.name, 14, y);
        y += 7;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        doc.text(`Location: ${hospital.city}, ${hospital.state}`, 14, y); y += 6;
        doc.text(`Timings: ${hospital.timings}`, 14, y); y += 6;
        doc.text(`Phone: ${hospital.phone}`, 14, y); y += 6;
        if (hospital.distance_km !== undefined) {
          doc.setTextColor(46, 125, 50);
          doc.setFont('helvetica', 'bold');
          doc.text(`Distance from you: ${hospital.distance_km} km`, 14, y);
          y += 6;
        }
        const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`;
        doc.setTextColor(26, 115, 232);
        doc.textWithLink('Open in Google Maps', 14, y, { url: mapsLink });
        y += 10;
      }

      // Step-by-step guide
      if (y > 210) { doc.addPage(); y = 20; }
      doc.setDrawColor(220, 220, 220);
      doc.line(14, y, W - 14, y);
      y += 5;
      doc.setFillColor(255, 243, 224);
      doc.rect(14, y, W - 28, 8, 'F');
      doc.setTextColor(245, 124, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Step-by-Step Process to Avail This Scheme', 16, y + 5.5);
      y += 14;

      const steps = [
        `Visit: ${hospital ? hospital.name + ', ' + hospital.city : 'the nearest empanelled government hospital'}`,
        'Carry all required documents listed above (originals + photocopies).',
        `Register under the scheme: "${scheme.name_en}" at the hospital reception.`,
        'Speak to the Ayushman Mitra or scheme helpdesk at the hospital.',
        'Complete verification and receive your treatment card or registration slip.',
        'Helpline: 14555 (Ayushman Bharat) | 1800-111-565 (National Health Mission)',
      ];

      steps.forEach((step, i) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(26, 115, 232);
        doc.setFontSize(10);
        doc.text(`Step ${i + 1}:`, 14, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(40, 40, 40);
        const sLines = doc.splitTextToSize(step, W - 46);
        doc.text(sLines, 36, y);
        y += sLines.length * 5 + 3;
      });

      // Footer on every page
      const pages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(160, 160, 160);
        doc.setFont('helvetica', 'normal');
        doc.text(
          'MedBridge — Free Government Healthcare Discovery | Data sourced from official Government of India portals',
          W / 2,
          doc.internal.pageSize.getHeight() - 8,
          { align: 'center' }
        );
        doc.text(
          `Page ${i} of ${pages}`,
          W - 14,
          doc.internal.pageSize.getHeight() - 8,
          { align: 'right' }
        );
      }

      doc.save(`MedBridge-${(scheme.name_en || 'Report').replace(/\s+/g, '-')}.pdf`);
    } catch (err) {
      console.error('[PdfExport] Error:', err);
      alert('Could not generate PDF. Please try again.');
    } finally {
      setGenerating(false);
    }
  }

  return (
    <button
      className={`pdf-export-btn ${generating ? 'pdf-export-btn--busy' : ''}`}
      onClick={generate}
      disabled={generating}
      title="Download scheme + hospital details as PDF"
    >
      {generating ? (
        <><span className="pdf-spinner" /> Generating…</>
      ) : (
        <>📄 Download PDF</>
      )}
    </button>
  );
}
