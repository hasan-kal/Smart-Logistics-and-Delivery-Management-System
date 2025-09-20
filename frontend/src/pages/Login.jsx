import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data);
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div>
      <div>
        {/* Header */}
        <div>
          <h1>Welcome Back</h1>
          <p>Sign in to your SmartLogistics account</p>
        </div>

        {/* Login Form */}
        <div>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <div>
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                />
                <label htmlFor="remember-me">
                  Remember me
                </label>
              </div>
              <div>
                <a href="#">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
            >
              Sign In
            </button>
          </form>

          {/* Sign Up Link */}
          <div>
            <p>
              Don't have an account?{' '}
              <a href="/signup">
                Sign up now
              </a>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div>
          <a href="/">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}