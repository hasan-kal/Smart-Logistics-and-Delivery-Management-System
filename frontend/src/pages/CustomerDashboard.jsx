import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";
import ShipmentMap from "../components/ShipmentMap";
import RouteMap from "../components/RouteMap";
import { toast } from "react-hot-toast";
import { NavLink } from "react-router-dom";

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
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Customer</h2>
        <NavLink to="/customer" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          My Shipments
        </NavLink>
        <NavLink to="/customer/profile" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Profile
        </NavLink>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <h1>Customer Dashboard</h1>
          <p>Track, manage, and create your shipments easily</p>
        </div>

        {/* Create Shipment Form */}
        <section className="form-section">
          <h2>Create New Shipment</h2>
          <form onSubmit={handleSubmit} className="shipment-form">
            <div className="form-group">
              <label>Pickup Address</label>
              <input
                type="text"
                placeholder="Enter pickup location"
                value={form.pickupAddress}
                onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Delivery Address</label>
              <input
                type="text"
                placeholder="Enter delivery location"
                value={form.deliveryAddress}
                onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
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

            <button type="submit" className="btn-primary">Create Shipment</button>
          </form>
        </section>

        {/* Shipments Section */}
        <section className="shipments-section">
          <h2>My Shipments</h2>
          {shipments.length === 0 ? (
            <p>No shipments found. Create one above!</p>
          ) : (
            <div className="shipments-grid">
              {shipments.map((s) => (
                <div key={s._id} className="shipment-card">
                  <h3>Shipment ID: {s._id.slice(-8)}</h3>
                  <p><strong>Pickup:</strong> {s.pickupAddress}</p>
                  <p><strong>Delivery:</strong> {s.deliveryAddress}</p>
                  <p><strong>Package:</strong> {s.packageType}</p>
                  <span className={`shipment-status ${s.status.toLowerCase().replace(" ", "-")}`}>{s.status}</span>

                  {(s.route || s.location) && (
                    <div className="map-wrapper">
                      {s.route ? <RouteMap route={s.route} /> : <ShipmentMap location={s.location} />}
                    </div>
                  )}

                  {s.status === "Booked" && (
                    <button onClick={() => cancelShipment(s._id)} className="btn-cancel">Cancel</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Map Section */}
        <section className="map-section">
          <h2>Live Route View</h2>
          {shipments.length > 0 && shipments[0].route ? (
            <RouteMap route={shipments[0].route} />
          ) : (
            <p>No active route available.</p>
          )}
        </section>
      </main>
    </div>
  );
}