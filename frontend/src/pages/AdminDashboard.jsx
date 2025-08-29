import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
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
      <div className="flex space-x-4 p-4 bg-gray-200">
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            isActive
              ? "text-white bg-blue-600 px-3 py-1 rounded font-semibold"
              : "text-blue-600 font-semibold"
          }
        >
          Live Dashboard
        </NavLink>
        <NavLink
          to="/admin/analytics"
          className={({ isActive }) =>
            isActive
              ? "text-white bg-blue-600 px-3 py-1 rounded font-semibold"
              : "text-blue-600 font-semibold"
          }
        >
          Analytics
        </NavLink>
      </div>

      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
        <ul>
          {shipments.map((s) => (
            <li key={s._id} className="border p-2 mb-2 rounded">
              {s.route ? (
                <RouteMap route={s.route} />
              ) : (
                <>
                  {s.pickupAddress} → {s.deliveryAddress} ({s.status})
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}