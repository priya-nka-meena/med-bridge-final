import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

export default function PdfDownload({ query, selectedScheme, selectedHospital, condition }) {
  const [loading, setLoading] = useState(false);
  const disabled = !selectedScheme || !selectedHospital || loading;

  async function handleDownload() {
    if (!selectedScheme || !selectedHospital) {
      alert('Please select one scheme and one hospital first.');
      return;
    }
    setLoading(true);
    try {
      const doc = new jsPDF();
      let y = 20;
      const line = (txt, size = 11) => {
        doc.setFontSize(size);
        const wrapped = doc.splitTextToSize(txt, 175);
        doc.text(wrapped, 18, y);
        y += wrapped.length * 6 + 2;
      };

      doc.setFontSize(16);
      doc.text('MedBridge Care Plan', 18, y);
      y += 10;

      line(`Search Query: ${query || 'N/A'}`);
      line(`Detected Condition: ${condition || 'General'}`);
      y += 2;

      doc.setFontSize(13);
      doc.text('Selected Scheme', 18, y);
      y += 8;
      line(selectedScheme.name_en);
      line(`Eligibility: ${selectedScheme.bpl_required ? 'BPL required' : 'Open to all'}`);
      line(`Income Limit: ${selectedScheme.income_limit ? `Rs ${Number(selectedScheme.income_limit).toLocaleString('en-IN')}` : 'No income cap'}`);
      line(`Apply At: ${selectedScheme.apply_at}`);
      line(`Documents: ${(selectedScheme.documents || []).join(', ')}`);
      y += 2;

      doc.setFontSize(13);
      doc.text('Selected Hospital', 18, y);
      y += 8;
      line(selectedHospital.name);
      line(`Address: ${selectedHospital.city}, ${selectedHospital.state}`);
      line(`Distance: ${selectedHospital.distance_km !== undefined ? `${selectedHospital.distance_km} km` : 'Not available'}`);
      line(`Phone: ${selectedHospital.phone || 'N/A'}`);

      y += 4;
      doc.setFontSize(13);
      doc.text('Step-by-step Process', 18, y);
      y += 8;
      line('1) Visit the selected hospital and ask for the scheme desk.');
      line('2) Carry all required documents listed above.');
      line('3) Register under the selected government scheme.');
      line('4) Contact hospital helpdesk if any issue arises.');

      doc.save('MedBridge-Results.pdf');
    } catch {
      alert('Could not generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className={`pdf-btn ${loading ? 'pdf-btn--loading' : ''}`}
      onClick={handleDownload}
      disabled={disabled}
      title={disabled ? 'Select scheme and hospital first' : 'Download results as PDF'}
    >
      {loading ? (
        <><span className="pdf-btn__spinner" /> Generating…</>
      ) : (
        <>📄 Download Care PDF</>
      )}
    </button>
  );
}
