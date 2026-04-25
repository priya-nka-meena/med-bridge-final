import React from 'react';

const SPECIALITY_MAP = {
  kidney_disease: 'Kidney',
  cancer:         'Oncology',
  heart_disease:  'Cardiology',
  diabetes:       'Diabetes',
  tuberculosis:   'TB & Chest',
  maternity:      'Maternity',
  child_health:   'Paediatrics',
  mental_health:  'Psychiatry',
  eye_disease:    'Ophthalmology',
  trauma:         'Trauma & Emergency',
};

export default function HospitalCard({ hospital, isSelected = false, onSelect }) {
  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${hospital.lat},${hospital.lng}`;
  const osmUrl   = `https://www.openstreetmap.org/?mlat=${hospital.lat}&mlon=${hospital.lng}#map=15/${hospital.lat}/${hospital.lng}`;

  return (
    <div className="hospital-card">
      <div className="hospital-card__top">
        <h3 className="hospital-card__name">{hospital.name}</h3>
        {hospital.distance_km !== undefined && (
          <span className="hospital-card__distance">
            📏 {hospital.distance_km} km
          </span>
        )}
      </div>

      <p className="hospital-card__meta">📍 {hospital.city}, {hospital.state}</p>
      <p className="hospital-card__meta">🕐 {hospital.timings}</p>
      <p className="hospital-card__meta">📞 {hospital.phone}</p>

      {/* Precise coordinates badge */}
      {hospital.lat && hospital.lng && (
        <p className="hospital-card__coords">
          🌐 {hospital.lat.toFixed(4)}°N, {hospital.lng.toFixed(4)}°E
        </p>
      )}

      {Array.isArray(hospital.speciality) && hospital.speciality.length > 0 && (
        <div className="hospital-card__tags">
          {hospital.speciality.slice(0, 4).map((s, i) => (
            <span key={i} className="speciality-tag">
              {SPECIALITY_MAP[s] || s}
            </span>
          ))}
        </div>
      )}

      <div className="hospital-card__actions">
        {onSelect && (
          <button type="button" onClick={() => onSelect(hospital)} className="hospital-card__btn hospital-card__btn--select">
            {isSelected ? '✓ Selected Hospital' : 'Select Hospital'}
          </button>
        )}
        <a href={gmapsUrl} target="_blank" rel="noopener noreferrer" className="hospital-card__btn hospital-card__btn--primary">
          🗺️ Google Maps
        </a>
        <a href={osmUrl}   target="_blank" rel="noopener noreferrer" className="hospital-card__btn hospital-card__btn--secondary">
          🌍 OpenStreetMap
        </a>
      </div>
    </div>
  );
}
