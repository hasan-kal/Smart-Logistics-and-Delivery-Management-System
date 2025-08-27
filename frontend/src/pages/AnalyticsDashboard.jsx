import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function AnalyticsDashboard() {
  const { token } = useContext(AuthContext);
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res1 = await api.get("/analytics/overview", {
          headers: { "x-auth-token": token },
        });
        setOverview(res1.data);

        const res2 = await api.get("/analytics/trends", {
          headers: { "x-auth-token": token },
        });
        setTrends(res2.data);
      } catch (err) {
        console.error("Error fetching analytics", err);
      }
    };

    fetchAnalytics();
  }, [token]);

  if (!overview) return <p>Loading analytics...</p>;

  const pieData = [
    { name: "Active", value: overview.activeDeliveries },
    { name: "Completed", value: overview.completedDeliveries },
    { name: "Cancelled", value: overview.cancelledDeliveries },
  ];

  const COLORS = ["#FFBB28", "#00C49F", "#FF4444"];

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
        <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded shadow">
            <h3 className="font-semibold">Total Shipments</h3>
            <p className="text-xl">{overview.totalShipments}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded shadow">
            <h3 className="font-semibold">Active Deliveries</h3>
            <p className="text-xl">{overview.activeDeliveries}</p>
          </div>
          <div className="bg-green-100 p-4 rounded shadow">
            <h3 className="font-semibold">Completed</h3>
            <p className="text-xl">{overview.completedDeliveries}</p>
          </div>
          <div className="bg-red-100 p-4 rounded shadow">
            <h3 className="font-semibold">Cancelled</h3>
            <p className="text-xl">{overview.cancelledDeliveries}</p>
          </div>
        </div>

        {/* Average Delivery Time */}
        <div className="mb-6">
          <h3 className="font-semibold">Average Delivery Time</h3>
          <p>{overview.avgDeliveryTime}</p>
        </div>

        {/* Line Chart: Shipments Over Time */}
        <div className="mb-10">
          <h3 className="font-semibold mb-4">Shipments Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Shipment Status Distribution */}
        <div>
          <h3 className="font-semibold mb-4">Shipment Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}