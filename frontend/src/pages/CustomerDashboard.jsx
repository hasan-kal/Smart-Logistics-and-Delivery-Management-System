import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";
import ShipmentMap from "../components/ShipmentMap";
import RouteMap from "../components/RouteMap";
import { toast } from "react-hot-toast";

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
    const socket = io("http://localhost:5001");

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
      toast.info(`Shipment ${data.id} status updated to ${data.status}`);
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
    <div>
      {/* Header */}
      <div>
        <div>
          <div>
            <h1>My Shipments</h1>
            <p>Manage and track your deliveries</p>
          </div>
          <div>Customer Dashboard</div>
        </div>
      </div>

      <div>
        {/* Create Shipment Form */}
        <div>
          <div>
            <div>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2>Create New Shipment</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div>
              {/* Pickup */}
              <div>
                <label>Pickup Address</label>
                <div>
                  <input
                    type="text"
                    placeholder="Enter pickup location"
                    value={form.pickupAddress}
                    onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
                    required
                  />
                  <div>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div>
                <label>Delivery Address</label>
                <div>
                  <input
                    type="text"
                    placeholder="Enter delivery location"
                    value={form.deliveryAddress}
                    onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
                    required
                  />
                  <div>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Package Type */}
            <div>
              <label>Package Type</label>
              <select
                value={form.packageType}
                onChange={(e) => setForm({ ...form, packageType: e.target.value })}
                required
              >
                <option value="">Select package type</option>
                <option value="Document">Document</option>
                <option value="Small Package">Small Package</option>
                <option value="Medium Package">Medium Package</option>
                <option value="Large Package">Large Package</option>
                <option value="Fragile">Fragile Item</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Shipment
              </button>
            </div>
          </form>
        </div>

        {/* Shipments List */}
        <div>
          {shipments.length === 0 ? (
            <div>No shipments yet. Create one above!</div>
          ) : (
            shipments.map((s) => (
              <div key={s._id}>
                <div>
                  <div>
                    <div>{s.status}</div>
                    <p>ID: {s._id.slice(-8)}</p>
                    <p>From: {s.pickupAddress}</p>
                    <p>To: {s.deliveryAddress}</p>
                    <p>Package: {s.packageType}</p>

                    {(s.route || s.location) && (
                      <div>
                        {s.route ? <RouteMap route={s.route} /> : <ShipmentMap location={s.location} />}
                      </div>
                    )}
                  </div>

                  <div>
                    {s.status === "Booked" && (
                      <button
                        onClick={() => cancelShipment(s._id)}
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}