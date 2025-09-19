import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";
import { NavLink } from "react-router-dom";
import { toast } from "react-hot-toast";
import RouteMap from "../components/RouteMap";

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
    <div>
      {/* Navigation */}
      <nav>
        <div>
          <div>
            <h1>Admin Dashboard</h1>
            <div>
              <NavLink
                to="/admin"
                className={({ isActive }) => isActive ? "admin-dashboard-link active" : "admin-dashboard-link"}
              >
                Live Dashboard
              </NavLink>
              <NavLink
                to="/admin/analytics"
                className={({ isActive }) => isActive ? "admin-dashboard-link active" : "admin-dashboard-link"}
              >
                Analytics
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div>
        <div>
          <h1>
            Live Dashboard
          </h1>
          <p>Monitor all shipments and delivery operations in real-time</p>
        </div>

        {/* Stats Cards */}
        <div>
          {[
            { title: "Total Shipments", count: shipments.length, iconColor: "blue", icon: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2" },
            { title: "In Transit", count: shipments.filter(s => s.status === 'In Transit').length, iconColor: "yellow", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
            { title: "Delivered", count: shipments.filter(s => s.status === 'Delivered').length, iconColor: "green", icon: "M5 13l4 4L19 7" },
            { title: "Cancelled", count: shipments.filter(s => s.status === 'Cancelled').length, iconColor: "red", icon: "M6 18L18 6M6 6l12 12" },
          ].map((card, idx) => (
            <div key={idx} data-color={card.iconColor}>
              <div>
                <div className={`icon-bg icon-bg-${card.iconColor}`}>
                  <svg className={`icon icon-${card.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                  </svg>
                </div>
                <div>
                  <p>{card.title}</p>
                  <p>{card.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shipments List */}
        <div>
          <div>
            <h2>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              All Shipments
            </h2>
          </div>

          {shipments.length === 0 ? (
            <div>No shipments found</div>
          ) : (
            <div>
              {shipments.map((s) => (
                <div key={s._id}>
                  <div>
                    <div>
                      <div>
                        <div>
                          {s.status}
                        </div>
                        <span>ID: {s._id.slice(-8)}</span>
                      </div>
                      <div>
                        <div>
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div>
                            <p>Pickup</p>
                            <p>{s.pickupAddress}</p>
                          </div>
                        </div>
                        <div>
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div>
                            <p>Delivery</p>
                            <p>{s.deliveryAddress}</p>
                          </div>
                        </div>
                      </div>

                      {/* Map Display */}
                      {s.route && (
                        <div>
                          <RouteMap route={s.route} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}