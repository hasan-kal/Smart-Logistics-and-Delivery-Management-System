import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";
import { NavLink } from "react-router-dom";
import { toast } from "react-hot-toast";
import RouteMap from "../components/RouteMap";
import "../styles/admindashboard.css";

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

    socket.on("shipmentCreated", () => {
      toast.success("A new shipment has been created!");
      fetchShipments();
    });

    socket.on("shipmentStatusUpdated", (data) => {
      toast.info(`Shipment ${data.id} status updated to ${data.status}`);
      fetchShipments();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Admin</h2>
        <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Live Dashboard
        </NavLink>
        <NavLink to="/admin/analytics" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Analytics
        </NavLink>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <h1>Admin Dashboard</h1>
          <p>Monitor all shipments and delivery operations in real-time</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {[
            { title: "Total Shipments", count: shipments.length, iconColor: "blue", icon: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2" },
            { title: "In Transit", count: shipments.filter(s => s.status === 'In Transit').length, iconColor: "yellow", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
            { title: "Delivered", count: shipments.filter(s => s.status === 'Delivered').length, iconColor: "green", icon: "M5 13l4 4L19 7" },
            { title: "Cancelled", count: shipments.filter(s => s.status === 'Cancelled').length, iconColor: "red", icon: "M6 18L18 6M6 6l12 12" },
          ].map((card, idx) => (
            <div key={idx} className="stat-card">
              <div className={`icon-bg icon-bg-${card.iconColor}`}>
                <svg className={`icon icon-${card.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                </svg>
              </div>
              <div>
                <h2>{card.title}</h2>
                <p>{card.count}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Shipments List */}
        <div className="recent-table">
          <h2>All Shipments</h2>
          {shipments.length === 0 ? (
            <p>No shipments found</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>ID</th>
                  <th>Pickup</th>
                  <th>Delivery</th>
                  <th>Route</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((s) => (
                  <tr key={s._id}>
                    <td>{s.status}</td>
                    <td>{s._id.slice(-8)}</td>
                    <td>{s.pickupAddress}</td>
                    <td>{s.deliveryAddress}</td>
                    <td>{s.route ? <RouteMap route={s.route} /> : "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}