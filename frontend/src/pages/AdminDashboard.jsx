import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";

export default function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const [shipments, setShipments] = useState([]);

  const fetchShipments = async () => {
    const res = await api.get("/shipments", {
      headers: { "x-auth-token": token },
    });
    setShipments(res.data);
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("agentLocationUpdated", (data) => {
      setShipments((prev) =>
        prev.map((s) =>
          s._id === data.id
            ? { ...s, location: { coordinates: [data.lng, data.lat] } }
            : s
        )
      );
    });

    socket.on("shipmentStatusUpdated", (data) => {
      setShipments((prev) =>
        prev.map((s) => (s._id === data.id ? { ...s, status: data.status } : s))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>

      <ul>
        {shipments.map((s) => (
          <li
            key={s._id}
            className="flex justify-between items-center border p-2 mb-2 rounded"
          >
            <span>
              <strong>Customer:</strong> {s.customer?.name || "N/A"} <br />
              <strong>Pickup:</strong> {s.pickupAddress} →{" "}
              <strong>Delivery:</strong> {s.deliveryAddress} <br />
              <strong>Status:</strong> {s.status} <br />
              {s.location && (
                <strong>
                  Location: {s.location.coordinates[1]}, {s.location.coordinates[0]}
                </strong>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}