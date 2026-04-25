import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import translations from '../translations';

const STATES = [
  'Delhi','Uttar Pradesh','Bihar','Rajasthan','Tamil Nadu',
  'Maharashtra','West Bengal','Karnataka','Madhya Pradesh','Gujarat',
];

const CONDITION_LABELS = {
  kidney_disease:'Kidney Disease', cancer:'Cancer',
  heart_disease:'Heart Disease',  diabetes:'Diabetes',
  tuberculosis:'Tuberculosis',    maternity:'Maternity',
  child_health:'Child Health',    mental_health:'Mental Health',
  eye_disease:'Eye Disease',      trauma:'Trauma / Injury',
};

const ALL_SCHEMES = [
  {
    id:'pmjay', name_en:'Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    name_hi:'प्रधानमंत्री जन आरोग्य योजना',
    condition:['kidney_disease','cancer','heart_disease','trauma','eye_disease','diabetes'],
    states:['all'], bpl_required:false, income_limit:250000,
    description_en:'Provides health coverage of Rs 5 lakh per family per year for secondary and tertiary hospitalization. No premium paid by beneficiary.',
    documents:['Aadhaar Card','Ration Card','Income Certificate','PM-JAY e-card (if registered)'],
    apply_at:'Nearest PM-JAY empanelled government hospital',
  },
  {
    id:'rsby', name_en:'Rashtriya Swasthya Bima Yojana (RSBY)',
    name_hi:'राष्ट्रीय स्वास्थ्य बीमा योजना',
    condition:['kidney_disease','heart_disease','diabetes','trauma','cancer'],
    states:['all'], bpl_required:true, income_limit:100000,
    description_en:'Smart card-based cashless health insurance for BPL families. Covers Rs 30,000 per family per year.',
    documents:['BPL Ration Card','Aadhaar Card','RSBY Smart Card','Family Photograph'],
    apply_at:'District Hospital or RSBY empanelled government hospital',
  },
  {
    id:'ntep', name_en:'National TB Elimination Programme (NTEP)',
    name_hi:'राष्ट्रीय क्षय रोग उन्मूलन कार्यक्रम',
    condition:['tuberculosis'], states:['all'], bpl_required:false, income_limit:null,
    description_en:'Free TB diagnosis, medicines, and Rs 500/month nutritional support. Available at all government health centres.',
    documents:['Aadhaar Card','Sputum Test Report (if available)','Bank Passbook'],
    apply_at:'Any government PHC, CHC, or District Hospital DOTS centre',
  },
  {
    id:'jsy', name_en:'Janani Suraksha Yojana (JSY)',
    name_hi:'जननी सुरक्षा योजना',
    condition:['maternity'], states:['all'], bpl_required:false, income_limit:null,
    description_en:'Cash assistance for institutional delivery. Rs 1400 for rural, Rs 1000 for urban mothers. Free delivery at government hospitals.',
    documents:['Aadhaar Card','ANC Card','Bank Passbook','BPL Card (if applicable)'],
    apply_at:'Government hospital, PHC, or CHC',
  },
  {
    id:'rbsk', name_en:'Rashtriya Bal Swasthya Karyakram (RBSK)',
    name_hi:'राष्ट्रीय बाल स्वास्थ्य कार्यक्रम',
    condition:['child_health'], states:['all'], bpl_required:false, income_limit:null,
    description_en:'Free health screening and treatment for children 0–18 years covering 30+ conditions.',
    documents:['Aadhaar Card','Birth Certificate','School ID (if applicable)'],
    apply_at:'Government school health camp or District Early Intervention Centre (DEIC)',
  },
  {
    id:'nmhp', name_en:'National Mental Health Programme (NMHP)',
    name_hi:'राष्ट्रीय मानसिक स्वास्थ्य कार्यक्रम',
    condition:['mental_health'], states:['all'], bpl_required:false, income_limit:null,
    description_en:'Free mental health services including consultation, medicines, and rehabilitation at government hospitals.',
    documents:['Aadhaar Card','Referral slip from PHC (if available)'],
    apply_at:'Government hospital psychiatry OPD or Community Health Centre',
  },
];

function SchemeRow({ scheme, lang }) {
  const [open, setOpen] = useState(false);
  const name = lang === 'hi' ? scheme.name_hi : scheme.name_en;

  return (
    <div className={`sb-scheme ${open ? 'sb-scheme--open' : ''}`}>
      <div className="sb-scheme__header" onClick={() => setOpen(v => !v)}>
        <div className="sb-scheme__title-wrap">
          <h3 className="sb-scheme__name">{name}</h3>
          <div className="sb-scheme__pills">
            {scheme.bpl_required && <span className="sb-pill sb-pill--bpl">BPL Required</span>}
            {scheme.income_limit && (
              <span className="sb-pill sb-pill--income">
                ≤ ₹{Number(scheme.income_limit).toLocaleString('en-IN')}
              </span>
            )}
            {!scheme.bpl_required && !scheme.income_limit && (
              <span className="sb-pill sb-pill--free">Open to All</span>
            )}
          </div>
        </div>
        <span className="sb-scheme__toggle-icon">{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div className="sb-scheme__body">
          <p className="sb-scheme__desc">{scheme.description_en}</p>
          <div className="sb-scheme__conditions">
            <strong>Applicable for: </strong>
            {scheme.condition.map(c => (
              <span key={c} className="sb-cond-tag">{CONDITION_LABELS[c] || c}</span>
            ))}
          </div>
          <div className="sb-scheme__docs">
            <strong>Required Documents:</strong>
            <ul>
              {scheme.documents.map((d, i) => (
                <li key={i}><span className="sb-check">✓</span> {d}</li>
              ))}
            </ul>
          </div>
          <p className="sb-scheme__apply">📍 Apply at: {scheme.apply_at}</p>
        </div>
      )}
    </div>
  );
}

export default function SchemeBrowser() {
  const navigate = useNavigate();
  const [lang,        setLang]        = useState('en');
  const [activeTab,   setActiveTab]   = useState('browse');
  const [filterCond,  setFilterCond]  = useState('');
  const [filterBpl,   setFilterBpl]   = useState(false);
  const [filterInc,   setFilterInc]   = useState('');
  const t = translations[lang] || translations.en;
  void t;
  void STATES;

  const browsed = ALL_SCHEMES.filter(s =>
    !filterCond || s.condition.includes(filterCond)
  );

  const eligible = ALL_SCHEMES.filter(s => {
    if (filterCond && !s.condition.includes(filterCond)) return false;
    if (s.bpl_required && !filterBpl) return false;
    if (s.income_limit && filterInc && Number(filterInc) > s.income_limit) return false;
    return true;
  });

  const displayed = activeTab === 'browse' ? browsed : eligible;

  return (
    <div className="sb-page">
      <header className="sb-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <span className="sb-header__brand">🏥 MedBridge — Scheme Browser</span>
        <div className="lang-toggle">
          <button className={`lang-btn ${lang === 'en' ? 'lang-btn--active' : ''}`} onClick={() => setLang('en')}>EN</button>
          <button className={`lang-btn ${lang === 'hi' ? 'lang-btn--active' : ''}`} onClick={() => setLang('hi')}>हिं</button>
        </div>
      </header>

      <main className="sb-main">
        <div className="sb-tabs">
          <button className={`sb-tab ${activeTab === 'browse' ? 'sb-tab--active' : ''}`} onClick={() => setActiveTab('browse')}>
            📋 Explore All Schemes
          </button>
          <button className={`sb-tab ${activeTab === 'eligibility' ? 'sb-tab--active' : ''}`} onClick={() => setActiveTab('eligibility')}>
            ✅ Check Eligibility
          </button>
        </div>

        <div className="sb-filters">
          <div className="sb-filter-group">
            <label className="sb-filter-label">Condition</label>
            <select className="sb-filter-select" value={filterCond} onChange={e => setFilterCond(e.target.value)}>
              <option value="">All Conditions</option>
              {Object.entries(CONDITION_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          {activeTab === 'eligibility' && (
            <>
              <div className="sb-filter-group">
                <label className="sb-filter-label">Annual Income ₹</label>
                <input
                  type="number"
                  className="sb-filter-input"
                  placeholder="e.g. 150000"
                  value={filterInc}
                  onChange={e => setFilterInc(e.target.value)}
                />
              </div>
              <div className="sb-filter-group sb-filter-group--check">
                <label className="bpl-label">
                  <input type="checkbox" checked={filterBpl} onChange={e => setFilterBpl(e.target.checked)} className="bpl-checkbox" />
                  <span>BPL Cardholder</span>
                </label>
              </div>
            </>
          )}
        </div>

        <div className="sb-count">
          Showing <strong>{displayed.length}</strong> scheme{displayed.length !== 1 ? 's' : ''}
          {activeTab === 'eligibility' && filterCond && ' matching your eligibility'}
        </div>

        <div className="sb-list">
          {displayed.length === 0 ? (
            <div className="sb-empty">
              <p>No schemes match your filters. Try adjusting the condition or eligibility criteria.</p>
            </div>
          ) : (
            displayed.map(s => <SchemeRow key={s.id} scheme={s} lang={lang} />)
          )}
        </div>

        <div className="sb-cta-row">
          <button className="sb-search-btn" onClick={() => navigate('/')}>
            🔍 Search for Your Condition
          </button>
        </div>
      </main>
    </div>
  );
}
