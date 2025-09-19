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
    <div>
      {/* Header */}
      <div>
        <div>
          <div>
            <div>
              <h1>Agent Dashboard</h1>
              <p>Manage your assigned deliveries</p>
            </div>
            <div>
              <div>
                Delivery Agent
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Stats Cards */}
        <div>
          <div>
            <div>
              <div>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p>Assigned Shipments</p>
                <p>{shipments.length}</p>
              </div>
            </div>
          </div>

          <div>
            <div>
              <div>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9l6-3" />
                </svg>
              </div>
              <div>
                <p>To Pick Up</p>
                <p>
                  {shipments.filter(s => s.status === 'Booked').length}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div>
              <div>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p>In Transit</p>
                <p>
                  {shipments.filter(s => s.status === 'In Transit').length}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div>
              <div>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p>Completed</p>
                <p>
                  {shipments.filter(s => s.status === 'Delivered').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipments List */}
        <div>
          <div>
            <h2>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              My Deliveries ({shipments.length})
            </h2>
          </div>

          {shipments.length === 0 ? (
            <div>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9l6-3" />
              </svg>
              <h3>No deliveries assigned</h3>
              <p>New deliveries will appear here when assigned to you</p>
            </div>
          ) : (
            <div>
              {shipments.map((s) => (
                <div key={s._id}>
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
                          <p>Pickup Location</p>
                          <p>{s.pickupAddress}</p>
                        </div>
                      </div>

                      <div>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <p>Delivery Location</p>
                          <p>{s.deliveryAddress}</p>
                        </div>
                      </div>
                    </div>

                    {/* Package Type */}
                    <div>
                      <span>Package Type: </span>
                      <span>{s.packageType || 'Not specified'}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div>
                    {s.status === "Booked" && (
                      <button
                        onClick={() => updateStatus(s._id, "Picked")}
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Mark Picked
                      </button>
                    )}

                    {s.status === "Picked" && (
                      <button
                        onClick={() => updateStatus(s._id, "In Transit")}
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Start Transit
                      </button>
                    )}

                    {s.status === "In Transit" && (
                      <button
                        onClick={() => updateStatus(s._id, "Delivered")}
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Mark Delivered
                      </button>
                    )}

                    <button
                      onClick={() => updateLocation(s._id)}
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Update Location
                    </button>
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