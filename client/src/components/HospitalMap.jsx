import React, { useState } from 'react';

export default function HospitalMap({ hospitals, userCoords }) {
  const [selected, setSelected] = useState(null);

  if (!hospitals || hospitals.length === 0) return null;

  // Use first hospital's coords as map center, or user's coords
  const center = userCoords ||
    (hospitals[0]?.lat && hospitals[0]?.lng
      ? { lat: hospitals[0].lat, lng: hospitals[0].lng }
      : { lat: 28.6139, lng: 77.2090 }); // Default: Delhi

  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${center.lng - 0.15}%2C${center.lat - 0.15}%2C${center.lng + 0.15}%2C${center.lat + 0.15}&layer=mapnik`;

  return (
    <div className="hospital-map">
      <div className="hospital-map__header">
        <h3 className="hospital-map__title">🗺️ Hospital Locations</h3>
        <span className="hospital-map__count">{hospitals.filter(h => h.lat && h.lng).length} on map</span>
      </div>

      {/* Embedded OpenStreetMap */}
      <div className="hospital-map__frame-wrap">
        <iframe
          title="Hospitals Map"
          className="hospital-map__frame"
          src={osmUrl}
          allowFullScreen
          loading="lazy"
        />
      </div>

      {/* Hospital list with precise coords */}
      <div className="hospital-map__list">
        {hospitals.filter(h => h.lat && h.lng).map((h, i) => {
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${h.lat},${h.lng}`;
          const osmPin  = `https://www.openstreetmap.org/?mlat=${h.lat}&mlon=${h.lng}#map=15/${h.lat}/${h.lng}`;

          return (
            <div
              key={h.id || i}
              className={`hospital-map__item ${selected === i ? 'hospital-map__item--active' : ''}`}
              onClick={() => setSelected(selected === i ? null : i)}
            >
              <div className="hospital-map__item-pin">{i + 1}</div>
              <div className="hospital-map__item-info">
                <strong>{h.name}</strong>
                <span>{h.city}, {h.state}</span>
                {h.distance_km !== undefined && (
                  <span className="hospital-map__item-dist">📏 {h.distance_km} km away</span>
                )}
              </div>
              <div className="hospital-map__item-links">
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="map-link map-link--gmaps">
                  G Maps
                </a>
                <a href={osmPin} target="_blank" rel="noopener noreferrer" className="map-link map-link--osm">
                  OSM
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
