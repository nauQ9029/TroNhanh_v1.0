import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// fix for default marker icons not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapView = ({ properties }) => {
  const defaultMapCenter = [16.0602205509697, 108.23152764139681];

  return (
    <div style={{ height: "600px", position: "sticky", top: "100px" }}>
      <MapContainer
        center={defaultMapCenter}
        zoom={13}
        scrollWheelZoom
        style={{ height: "100%", minHeight: 600 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map((property) =>
          property.mapPosition && property.mapPosition.length === 2 ? (
            <Marker key={property.id} position={property.mapPosition}>
              <Popup>
                <strong>{property.title}</strong>
                <br />
                from{" "}
                <span style={{ fontWeight: "bold" }}>
                  {property.price.toLocaleString("vi-VN")}₫
                </span>{" "}
                /month
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;
