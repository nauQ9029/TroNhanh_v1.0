import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix for default marker icons not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapView = () => {
  // const londonCenter = [51.5074, -0.1278];
  const defaultMapCenter = [53.51, -2.53];

  // Sau nay them toa do cho cac riel property (fix cung)
  const properties = [
    { id: 1, position: [51.515, -0.1], title: "Property 1", price: 3490 },
    { id: 2, position: [51.505, -0.13], title: "Property 2", price: 3990 },
    { id: 3, position: [52.727, -1.1], title: "Property 3", price: 3490 },
    { id: 4, position: [55.51, -2.12], title: "Property 4", price: 3490 },
    { id: 5, position: [56.51, -3.43], title: "Property 5", price: 3490 },
    { id: 6, position: [55.21, -4.8], title: "Property 6", price: 3490 },
    { id: 7, position: [53.51, -2.53], title: "Property 7", price: 3490 },
    { id: 8, position: [55.51, -4.43], title: "Property 8", price: 3490 },
    { id: 9, position: [55.51, -2.32], title: "Property 9", price: 3490 },
    { id: 10, position: [52.51, -0.12], title: "Property 10", price: 3490 },
  ];

  return (
    <div style={{ height: "600px", position: "sticky", top: "100px" }}>
      <MapContainer
        center={defaultMapCenter}
        zoom={6}
        scrollWheelZoom
        style={{ height: "100%", minHeight: 600 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map((property) =>
          property.position ? (
            <Marker key={property.id} position={property.position}>
              <Popup>
                <strong>{property.title}</strong>
                <br />
                from £{property.price} /month
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;
