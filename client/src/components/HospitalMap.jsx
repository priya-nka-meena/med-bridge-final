import React, { useState } from 'react';

export default function HospitalMap({ hospitals, userCoords }) {
  const [selected, setSelected] = useState(null);

  const visible = (hospitals || []).filter(h => h.lat && h.lng);
  if (visible.length === 0) return null;

  // Map center: user's location if available, else first hospital
  const center = userCoords || { lat: visible[0].lat, lng: visible[0].lng };

  // Bounding box for map
  const lats = visible.map(h => h.lat);
  const lngs = visible.map(h => h.lng);
  const minLat = Math.min(...lats, center.lat) - 0.05;
  const maxLat = Math.max(...lats, center.lat) + 0.05;
  const minLng = Math.min(...lngs, center.lng) - 0.05;
  const maxLng = Math.max(...lngs, center.lng) + 0.05;

  // OSM embed — shows all pins in bounding box
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik`;

  // For routing: use Google Maps directions from user location to selected hospital
  const getRoutingUrl = (hospital) => {
    if (userCoords) {
      return `https://www.google.com/maps/dir/${userCoords.lat},${userCoords.lng}/${hospital.lat},${hospital.lng}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${hospital.lat},${hospital.lng}`;
  };

  const getOsmPin = (hospital) =>
    `https://www.openstreetmap.org/?mlat=${hospital.lat}&mlon=${hospital.lng}#map=15/${hospital.lat}/${hospital.lng}`;

  // Full-route Google Maps URL for all hospitals from user location
  const multiHospitalUrl = userCoords
    ? `https://www.google.com/maps/dir/${userCoords.lat},${userCoords.lng}/${visible.slice(0,3).map(h => `${h.lat},${h.lng}`).join('/')}`
    : null;

  return (
    <div className="hospital-map">
      <div className="hospital-map__header">
        <h3 className="hospital-map__title">🗺️ Hospital Map</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {userCoords && (
            <span style={{ fontSize: 11, color: 'var(--green-dark)', background: 'var(--green-light)', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
              📍 Location resolved
            </span>
          )}
          <span className="hospital-map__count">{visible.length} pins</span>
        </div>
      </div>

      {/* Embedded OpenStreetMap */}
      <div className="hospital-map__frame-wrap">
        <iframe
          title="Hospital Locations Map"
          className="hospital-map__frame"
          src={osmUrl}
          allowFullScreen loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Route button */}
      {userCoords && multiHospitalUrl && (
        <div style={{ padding: '10px 16px', background: 'var(--blue-light)', borderBottom: '1px solid var(--blue-muted)' }}>
          <a
            href={multiHospitalUrl}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 13, fontWeight: 700, color: 'var(--blue)',
            }}
          >
            🗺️ View Route from Your Location to All Hospitals →
          </a>
        </div>
      )}

      {/* Hospital list */}
      <div className="hospital-map__list">
        {visible.map((h, i) => (
          <div
            key={h.id || i}
            className={`hospital-map__item ${selected === i ? 'hospital-map__item--active' : ''}`}
            onClick={() => setSelected(selected === i ? null : i)}
          >
            <div className="hospital-map__pin">{i + 1}</div>
            <div className="hospital-map__item-info">
              <strong>{h.name}</strong>
              <span>{h.city}, {h.state}</span>
              {h.distance_km !== undefined && (
                <span className="hospital-map__dist">📏 {h.distance_km} km from you</span>
              )}
            </div>
            <div className="hospital-map__links">
              <a href={getRoutingUrl(h)} target="_blank" rel="noopener noreferrer" className="map-link map-link--gmaps"
                onClick={e => e.stopPropagation()}>
                {userCoords ? 'Route' : 'G Maps'}
              </a>
              <a href={getOsmPin(h)} target="_blank" rel="noopener noreferrer" className="map-link map-link--osm"
                onClick={e => e.stopPropagation()}>
                OSM
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
