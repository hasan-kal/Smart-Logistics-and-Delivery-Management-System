import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";
import "../styles/agentdashboard.css";

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
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Agent</h2>
        <NavLink to="/agent" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Active Deliveries</NavLink>
        <NavLink to="/agent/completed" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Completed</NavLink>
        <NavLink to="/agent/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Profile</NavLink>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="topbar">
          <h1>Agent Dashboard</h1>
          <p>Welcome back, manage your deliveries efficiently</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card"><h2>Total Deliveries</h2><p>{shipments.length}</p></div>
          <div className="stat-card"><h2>To Pick Up</h2><p>{shipments.filter(s => s.status === "Booked").length}</p></div>
          <div className="stat-card"><h2>In Transit</h2><p>{shipments.filter(s => s.status === "In Transit").length}</p></div>
          <div className="stat-card"><h2>Delivered</h2><p>{shipments.filter(s => s.status === "Delivered").length}</p></div>
        </div>

        {/* Deliveries Table */}
        <div className="deliveries-table">
          <h2>My Deliveries ({shipments.length})</h2>
          {shipments.length === 0 ? (
            <p>No deliveries assigned</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>ID</th>
                  <th>Pickup</th>
                  <th>Delivery</th>
                  <th>Package</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((s) => (
                  <tr key={s._id}>
                    <td>{s.status}</td>
                    <td>{s._id.slice(-8)}</td>
                    <td>{s.pickupAddress}</td>
                    <td>{s.deliveryAddress}</td>
                    <td>{s.packageType || "Not specified"}</td>
                    <td>
                      {s.status === "Booked" && (
                        <button onClick={() => updateStatus(s._id, "Picked")}>Mark Picked</button>
                      )}
                      {s.status === "Picked" && (
                        <button onClick={() => updateStatus(s._id, "In Transit")}>Start Transit</button>
                      )}
                      {s.status === "In Transit" && (
                        <button onClick={() => updateStatus(s._id, "Delivered")}>Mark Delivered</button>
                      )}
                      <button onClick={() => updateLocation(s._id)}>Update Location</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Map Section */}
        <div className="map-section">
          <h2>Route Map</h2>
          {shipments.length > 0 && shipments[0].route ? (
            <RouteMap route={shipments[0].route} />
          ) : (
            <p>No active routes available</p>
          )}
        </div>
      </main>
    </div>
  );
}