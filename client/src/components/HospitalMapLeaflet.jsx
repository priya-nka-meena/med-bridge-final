import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icons broken by Vite bundler
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const USER_ICON = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const HOSPITAL_ICON = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 12, { animate: true });
  }, [center, map]);
  return null;
}

export default function HospitalMapLeaflet({ hospitals, userCoords }) {
  const defaultCenter = userCoords
    ? [userCoords.lat, userCoords.lng]
    : hospitals.length > 0 && hospitals[0].lat
      ? [hospitals[0].lat, hospitals[0].lng]
      : [28.6139, 77.2090];

  const validHospitals = (hospitals || []).filter(h => h.lat && h.lng);

  return (
    <div className="leaflet-map-wrap">
      <MapContainer
        center={defaultCenter}
        zoom={11}
        style={{ width: '100%', height: '380px', borderRadius: '0 0 12px 12px' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap center={defaultCenter} />

        {userCoords && (
          <Marker position={[userCoords.lat, userCoords.lng]} icon={USER_ICON}>
            <Popup>
              <strong>📍 Your Location</strong>
            </Popup>
          </Marker>
        )}

        {validHospitals.map((h, i) => (
          <Marker key={h.id || i} position={[h.lat, h.lng]} icon={HOSPITAL_ICON}>
            <Popup>
              <div style={{ minWidth: 180 }}>
                <strong style={{ fontSize: 13 }}>{h.name}</strong><br />
                <span style={{ fontSize: 12, color: '#555' }}>
                  📍 {h.city}, {h.state}
                </span><br />
                {h.distance_km !== undefined && (
                  <span style={{ fontSize: 12, color: '#2e7d32', fontWeight: 700 }}>
                    📏 {h.distance_km} km away
                  </span>
                )}
                <br />
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block', marginTop: 8,
                    padding: '5px 12px', background: '#1a73e8', color: '#fff',
                    borderRadius: 6, fontSize: 12, fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  🗺️ Get Directions
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
