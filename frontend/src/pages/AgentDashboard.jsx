import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";

export default function AgentDashboard() {
  const { token } = useContext(AuthContext);
  const [shipments, setShipments] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const fetchShipments = async () => {
    const res = await api.get("/shipments", {
      headers: { "x-auth-token": token },
    });
    const assigned = res.data.filter(s => s.agent && s.agent._id);
    setShipments(assigned);
  };

  useEffect(() => {
    fetchShipments();
    // eslint-disable-next-line
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/shipments/${id}/status`, { status }, {
      headers: { "x-auth-token": token },
    });
    if (socket) socket.emit("updateStatus", { id, status });
    fetchShipments();
  };

  const updateLocation = async (id) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        await api.put(`/shipments/${id}/location`, { lat: latitude, lng: longitude }, {
          headers: { "x-auth-token": token },
        });
        if (socket) socket.emit("updateLocation", { id, lat: latitude, lng: longitude });
      });
    } else {
      alert("Geolocation not supported");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Agent Dashboard</h2>
      <ul>
        {shipments.map((s) => (
          <li key={s._id} className="border p-3 mb-3 rounded">
            <p><strong>Pickup:</strong> {s.pickupAddress}</p>
            <p><strong>Delivery:</strong> {s.deliveryAddress}</p>
            <p><strong>Status:</strong> {s.status}</p>

            <div className="flex gap-2 mt-2">
              {s.status === "Booked" && (
                <button onClick={() => updateStatus(s._id, "Picked")} className="bg-yellow-500 px-3 py-1 text-white rounded">
                  Mark Picked
                </button>
              )}
              {s.status === "Picked" && (
                <button onClick={() => updateStatus(s._id, "In Transit")} className="bg-blue-500 px-3 py-1 text-white rounded">
                  Start Transit
                </button>
              )}
              {s.status === "In Transit" && (
                <button onClick={() => updateStatus(s._id, "Delivered")} className="bg-green-600 px-3 py-1 text-white rounded">
                  Mark Delivered
                </button>
              )}
              <button onClick={() => updateLocation(s._id)} className="bg-gray-600 px-3 py-1 text-white rounded">
                Update Location
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}