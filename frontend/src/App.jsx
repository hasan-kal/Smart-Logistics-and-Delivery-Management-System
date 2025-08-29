import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import { Toaster } from "react-hot-toast";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {!user ? (
          <>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : user.role === "admin" ? (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </>
        ) : user.role === "agent" ? (
          <Route path="/*" element={<h1 className="p-6">Agent Dashboard</h1>} />
        ) : (
          <Route path="/*" element={<CustomerDashboard />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
