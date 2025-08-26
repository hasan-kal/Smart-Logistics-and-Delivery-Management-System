import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {!user ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : user.role === "admin" ? (
          <Route path="/*" element={<AdminDashboard />} />
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
