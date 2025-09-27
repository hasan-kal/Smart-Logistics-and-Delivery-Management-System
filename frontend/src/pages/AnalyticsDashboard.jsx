import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import "../styles/analyticsdashboard.css";
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
    <div className="dashboard-container">
      {/* Navigation */}
      <aside className="sidebar">
        <NavLink to="/admin" className="nav-link">
          Live Dashboard
        </NavLink>
        <NavLink to="/admin/analytics" className="nav-link">
          Analytics
        </NavLink>
      </aside>

      <main className="main-content">
        {/* Header */}
        <div className="topbar">
          <h1>Analytics Dashboard</h1>
          <p>Comprehensive insights into your logistics operations</p>
        </div>

        {/* KPI Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p>Total Shipments</p>
              <p>{overview.totalShipments}</p>
            </div>
          </div>

          <div className="stat-card">
            <div>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p>Active Deliveries</p>
              <p>{overview.activeDeliveries}</p>
            </div>
          </div>

          <div className="stat-card">
            <div>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p>Completed</p>
              <p>{overview.completedDeliveries}</p>
            </div>
          </div>

          <div className="stat-card">
            <div>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p>Cancelled</p>
              <p>{overview.cancelledDeliveries}</p>
            </div>
          </div>
        </div>

        {/* Average Delivery Time */}
        <div className="stat-card">
          <div>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3>Average Delivery Time</h3>
            <p>{overview.avgDeliveryTime}</p>
            <p>Time from booking to delivery</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="chart-section">
          {/* Line Chart: Shipments Over Time */}
          <div className="stat-card">
            <div>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3>Shipments Over Time</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="_id"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#4f46e5', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart: Shipment Status Distribution */}
          <div className="stat-card">
            <div>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
              <h3>Status Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}