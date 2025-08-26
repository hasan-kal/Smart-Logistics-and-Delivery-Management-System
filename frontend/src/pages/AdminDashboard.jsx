import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

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
              <strong>Status:</strong> {s.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}