import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function ResizeMap() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

export default function MapResult({ motels, onClose }) {
  return (
    <div className="map-modal-overlay">
      <div className="map-modal-content">
        <button className="close-button" onClick={onClose}>×</button>

        <div className="map-wrapper">
          <MapContainer center={[16.0544, 108.2022]} zoom={14} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <ResizeMap />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {motels.map((motel, idx) => (
              <Marker key={idx} position={[motel.lat, motel.lng]}>
                <Popup>
                  <strong>{motel.name}</strong><br />
                  {motel.address}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
