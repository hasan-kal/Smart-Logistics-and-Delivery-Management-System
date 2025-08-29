import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function RouteMap({ route }) {
  const [center, setCenter] = useState([28.6139, 77.2090]); // Default Delhi
  const [agentLocation, setAgentLocation] = useState(null);

  useEffect(() => {
    if (route?.geometry?.coordinates?.length > 0) {
      const [lng, lat] = route.geometry.coordinates[0];
      setCenter([lat, lng]);
    }
  }, [route]);

  // Connect to Socket.IO for live agent updates
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("agentLocationUpdated", (data) => {
      setAgentLocation([data.lat, data.lng]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <MapContainer center={center} zoom={12} style={{ height: "500px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Route Line */}
      {route?.geometry?.coordinates && (
        <Polyline
          positions={route.geometry.coordinates.map(([lng, lat]) => [lat, lng])}
          color="blue"
        />
      )}

      {/* Start Marker */}
      {route?.geometry?.coordinates?.length > 0 && (
        <Marker position={[route.geometry.coordinates[0][1], route.geometry.coordinates[0][0]]}>
          <Popup>Pickup Location</Popup>
        </Marker>
      )}

      {/* End Marker */}
      {route?.geometry?.coordinates?.length > 0 && (
        <Marker position={[route.geometry.coordinates.at(-1)[1], route.geometry.coordinates.at(-1)[0]]}>
          <Popup>Delivery Location</Popup>
        </Marker>
      )}

      {/* Live Agent Marker */}
      {agentLocation && (
        <Marker position={agentLocation}>
          <Popup>Delivery Agent (Live)</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}