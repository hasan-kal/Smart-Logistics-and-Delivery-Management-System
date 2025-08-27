import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";

export default function CustomerDashboard() {
  const { token } = useContext(AuthContext);
  const [shipments, setShipments] = useState([]);
  const [form, setForm] = useState({
    pickupAddress: "",
    deliveryAddress: "",
    packageType: ""
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/shipments", form, {
      headers: { "x-auth-token": token },
    });
    setForm({ pickupAddress: "", deliveryAddress: "", packageType: "" });
    fetchShipments();
  };

  const cancelShipment = async (id) => {
    await api.put(`/shipments/${id}/cancel`, {}, {
      headers: { "x-auth-token": token },
    });
    fetchShipments();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Shipments</h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Pickup Address"
          value={form.pickupAddress}
          onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Delivery Address"
          value={form.deliveryAddress}
          onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Package Type"
          value={form.packageType}
          onChange={(e) => setForm({ ...form, packageType: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Shipment
        </button>
      </form>

      <ul>
        {shipments.map((s) => (
          <li key={s._id} className="flex justify-between items-center border p-2 mb-2 rounded">
            <span>
              {s.pickupAddress} → {s.deliveryAddress} ({s.status})
              {s.location && (
                <div>
                  <small>
                    Location: {s.location.coordinates[1]}, {s.location.coordinates[0]}
                  </small>
                </div>
              )}
            </span>
            {s.status === "Booked" && (
              <button onClick={() => cancelShipment(s._id)} className="bg-red-500 text-white px-3 py-1 rounded">
                Cancel
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}