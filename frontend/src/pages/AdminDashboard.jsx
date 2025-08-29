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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-extrabold text-gray-900">Admin Dashboard</h1>
            <div className="flex space-x-4">
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive
                    ? "bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                    : "text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                }
              >
                Live Dashboard
              </NavLink>
              <NavLink
                to="/admin/analytics"
                className={({ isActive }) =>
                  isActive
                    ? "bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                    : "text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                }
              >
                Analytics
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 mb-2">
            Live Dashboard
          </h1>
          <p className="text-gray-600">Monitor all shipments and delivery operations in real-time</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Total Shipments", count: shipments.length, iconColor: "blue", icon: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2" },
            { title: "In Transit", count: shipments.filter(s => s.status === 'In Transit').length, iconColor: "yellow", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
            { title: "Delivered", count: shipments.filter(s => s.status === 'Delivered').length, iconColor: "green", icon: "M5 13l4 4L19 7" },
            { title: "Cancelled", count: shipments.filter(s => s.status === 'Cancelled').length, iconColor: "red", icon: "M6 18L18 6M6 6l12 12" },
          ].map((card, idx) => (
            <div key={idx} className={`bg-gradient-to-br from-${card.iconColor}-50 to-${card.iconColor}-100 p-6 rounded-2xl shadow-lg border border-${card.iconColor}-200 transition-transform duration-300 hover:scale-105`}>
              <div className="flex items-center">
                <div className={`bg-${card.iconColor}-100 p-3 rounded-lg`}>
                  <svg className={`w-6 h-6 text-${card.iconColor}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shipments List */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <svg className="w-6 h-6 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              All Shipments
            </h2>
          </div>

          {shipments.length === 0 ? (
            <div className="p-12 text-center text-gray-400">No shipments found</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {shipments.map((s) => (
                <div key={s._id} className="p-6 hover:bg-gray-50 transition-colors duration-200 rounded-xl shadow-sm mb-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          s.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          s.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                          s.status === 'Picked' ? 'bg-yellow-100 text-yellow-800' :
                          s.status === 'Booked' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {s.status}
                        </div>
                        <span className="ml-3 text-sm text-gray-500">ID: {s._id.slice(-8)}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Pickup</p>
                            <p className="text-sm text-gray-600">{s.pickupAddress}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Delivery</p>
                            <p className="text-sm text-gray-600">{s.deliveryAddress}</p>
                          </div>
                        </div>
                      </div>

                      {/* Map Display */}
                      {s.route && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg transition-transform duration-300 hover:scale-105">
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