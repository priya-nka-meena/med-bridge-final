import React, { useState } from 'react';
import ConditionBadge from './ConditionBadge';

const CONDITION_META = {
  kidney_disease: { label: 'Kidney Disease', icon: '🫁', bg: '#EFF6FF', color: '#1D4ED8' },
  cancer:         { label: 'Cancer',         icon: '🔬', bg: '#FEF2F2', color: '#B91C1C' },
  heart_disease:  { label: 'Heart Disease',  icon: '❤️', bg: '#FFF1F2', color: '#E11D48' },
  diabetes:       { label: 'Diabetes',       icon: '💉', bg: '#FFFBEB', color: '#B45309' },
  tuberculosis:   { label: 'Tuberculosis',   icon: '🫁', bg: '#F5F3FF', color: '#6D28D9' },
  maternity:      { label: 'Maternity',      icon: '🤰', bg: '#FDF2F8', color: '#9D174D' },
  child_health:   { label: 'Child Health',   icon: '👶', bg: '#ECFDF5', color: '#065F46' },
  mental_health:  { label: 'Mental Health',  icon: '🧠', bg: '#EFF6FF', color: '#1E40AF' },
  eye_disease:    { label: 'Eye Disease',    icon: '👁️', bg: '#F5F3FF', color: '#5B21B6' },
  trauma:         { label: 'Trauma',         icon: '🩹', bg: '#FFFBEB', color: '#92400E' },
  general:        { label: 'General',        icon: '🏥', bg: '#F8FAFC', color: '#475569' },
};

export default function SchemeCard({ scheme, lang = 'en', isTop = false }) {
  const [open, setOpen] = useState(false);
  const name        = lang === 'hi' ? scheme.name_hi        : scheme.name_en;
  const description = lang === 'hi' ? scheme.description_hi : scheme.description_en;
  const cond = scheme.matched_condition || 'general';
  const meta = CONDITION_META[cond] || CONDITION_META.general;

  return (
    <div className={`scheme-card ${isTop ? 'scheme-card--top' : ''}`}>
      <div className="scheme-card__topbar" />
      <div className="scheme-card__inner">
        <div className="scheme-card__header">
          <h3 className="scheme-card__name">{name}</h3>
          <div className="scheme-card__pills">
            {scheme.bpl_required && <span className="pill pill--bpl">BPL</span>}
            {scheme.income_limit && (
              <span className="pill pill--income">≤₹{Number(scheme.income_limit).toLocaleString('en-IN')}</span>
            )}
            {!scheme.bpl_required && !scheme.income_limit && (
              <span className="pill pill--free">Open to All</span>
            )}
            {(scheme.age_min > 0 || scheme.age_max < 120) && (
              <span className="pill pill--age">
                {scheme.age_min}–{scheme.age_max === 120 ? '120+' : scheme.age_max} yrs
              </span>
            )}
          </div>
        </div>

        {scheme.benefit_amount && (
          <div className="scheme-card__benefit">✦ {scheme.benefit_amount}</div>
        )}

        {scheme.matched_condition && (
          <div style={{ marginBottom: 8 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px',
              borderRadius: '99px', fontSize: 12, fontWeight: 600,
              background: meta.bg, color: meta.color,
            }}>
              {meta.icon} {meta.label}
            </span>
          </div>
        )}

        <p className="scheme-card__desc">{description}</p>
      </div>

      <button className="scheme-card__toggle" onClick={() => setOpen(v => !v)} aria-expanded={open}>
        <span>{open ? '▲' : '▼'}</span>
        {open ? 'Hide Documents & Details' : 'View Required Documents'}
      </button>

      {open && (
        <div className="scheme-card__docs">
          <ul className="doc-list">
            {(scheme.documents || []).map((doc, i) => (
              <li key={i} className="doc-list__item">
                <span className="doc-list__check">✓</span>
                <span>{doc}</span>
              </li>
            ))}
          </ul>
          <p className="scheme-card__apply">📍 {scheme.apply_at}</p>
          {scheme.official_url && (
            <a href={scheme.official_url} target="_blank" rel="noopener noreferrer" className="scheme-card__url">
              🔗 Official Portal ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}
