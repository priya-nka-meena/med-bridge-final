import React, { useState } from 'react';
import ConditionBadge from './ConditionBadge';

export default function SchemeCard({
  scheme,
  lang = 'en',
  isTop = false,
  isSelected = false,
  onSelect,
  showEligibility = false,
}) {
  const [open, setOpen] = useState(false);

  const name        = lang === 'hi' ? scheme.name_hi        : scheme.name_en;
  const description = lang === 'hi' ? scheme.description_hi : scheme.description_en;
  const eligibility = [
    scheme.bpl_required ? 'BPL card required' : 'Open to all families',
    scheme.income_limit ? `Income up to Rs ${Number(scheme.income_limit).toLocaleString('en-IN')}` : 'No income cap',
    scheme.states?.includes('all') ? 'Available across India' : `Available in: ${(scheme.states || []).join(', ')}`,
  ];

  return (
    <div className={`scheme-card ${isTop ? 'scheme-card--top' : ''} ${isSelected ? 'scheme-card--selected' : ''}`}>
      {isTop && <div className="scheme-card__top-tag">⭐ Best Match</div>}

      <div className="scheme-card__header">
        <h3 className="scheme-card__name">{name}</h3>
        <div className="scheme-card__pills">
          {scheme.bpl_required && (
            <span className="pill pill--bpl">BPL Required</span>
          )}
          {scheme.income_limit && (
            <span className="pill pill--income">
              ≤ ₹{Number(scheme.income_limit).toLocaleString('en-IN')}
            </span>
          )}
          {!scheme.bpl_required && !scheme.income_limit && (
            <span className="pill pill--free">Open to All</span>
          )}
        </div>
      </div>

      {scheme.matched_condition && (
        <div className="scheme-card__condition">
          <ConditionBadge condition={scheme.matched_condition} />
        </div>
      )}

      <p className="scheme-card__desc">{description}</p>

      {showEligibility && (
        <div className="scheme-card__eligibility">
          {eligibility.map((point) => (
            <p key={point}>• {point}</p>
          ))}
        </div>
      )}

      {onSelect && (
        <button className="scheme-card__select" onClick={() => onSelect(scheme)}>
          {isSelected ? '✓ Selected Scheme' : 'Select This Scheme'}
        </button>
      )}

      <button
        className="scheme-card__toggle"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        {open ? '▲ Hide Documents' : '▼ View Required Documents'}
      </button>

      {open && (
        <div className="scheme-card__docs">
          <ul className="doc-list">
            {scheme.documents.map((doc, i) => (
              <li key={i} className="doc-list__item">
                <span className="doc-list__check">✓</span>
                <span>{doc}</span>
              </li>
            ))}
          </ul>
          <p className="scheme-card__apply">📍 {scheme.apply_at}</p>
        </div>
      )}
    </div>
  );
}
