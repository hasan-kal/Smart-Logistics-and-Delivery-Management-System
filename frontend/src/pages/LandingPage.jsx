import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function LandingPage() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      {/* Navigation */}
      <nav>
        <div>
          <div>
            <div>
              <h1>
                SmartLogistics
              </h1>
            </div>
            <div>
              {!user ? (
                <>
                  <Link
                    to="/login"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <div>
                  Welcome back, {user.name}!
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section>
        <h1>
          Smart Logistics & Delivery Management
        </h1>
        <p>
          Revolutionize your delivery operations with our intelligent logistics platform. Track shipments in real-time, optimize routes, and deliver with confidence.
        </p>
        {!user ? (
          <div>
            <Link
              to="/signup"
            >
              Get Started
            </Link>
            <Link
              to="/login"
            >
              Sign In
            </Link>
          </div>
        ) : (
          <p>You're logged in as a {user.role}.</p>
        )}
      </section>

      {/* Features Section */}
      <section>
        <div>
          <div>
            <h3>Real-time Tracking</h3>
            <p>
              Monitor your shipments live with GPS tracking and instant updates.
            </p>
          </div>
          <div>
            <h3>Analytics Dashboard</h3>
            <p>
              Gain insights with detailed analytics and performance metrics.
            </p>
          </div>
          <div>
            <h3>Secure & Reliable</h3>
            <p>
              Enterprise-grade security and 99.9% uptime for peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section>
          <div>
            <h2>
              Ready to Transform Your Logistics?
            </h2>
            <Link
              to="/signup"
            >
              Start Your Free Trial
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer>
        <div>
          <h3>SmartLogistics</h3>
          <div>
            <a
              href="#"
              aria-label="Twitter"
            >
              <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 19c7 0 10-6 10-10v-.5A7.1 7.1 0 0020 6a7 7 0 01-2 1 3.5 3.5 0 001.5-2 7 7 0 01-2 1 3.5 3.5 0 00-6 3 10 10 0 01-7-3 3.5 3.5 0 001 5 3.5 3.5 0 01-1.5-.5v.1a3.5 3.5 0 002.8 3.5 3.5 3.5 0 01-1.5.1 3.5 3.5 0 003.3 2.5A7 7 0 018 19" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="GitHub"
            >
              <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2a10 10 0 00-3 19.5c.5.1.7-.2.7-.5v-2c-3 .7-3.7-1.4-3.7-1.4a2.9 2.9 0 00-1.3-1.8c-1-.7.1-.7.1-.7a2.3 2.3 0 011.7 1.2 2.4 2.4 0 003.3 1 2.4 2.4 0 01.7-1.5c-2.4-.3-5-1.2-5-5.3a4.1 4.1 0 011-2.8 3.8 3.8 0 01.1-2.7s.8-.3 2.8 1a9.4 9.4 0 015 0c2-.1 2.8-1 2.8-1a3.8 3.8 0 01.1 2.7 4 4 0 011 2.8c0 4.1-2.6 5-5 5.3a2.7 2.7 0 01.8 2v3c0 .3.2.6.7.5A10 10 0 0012 2z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
            >
              <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.94 6.94A2.06 2.06 0 115 5a2.06 2.06 0 011.94 1.94zM4 8.5h5v12H4zM9.5 8.5h4.5v1.7h.1a5 5 0 014.5-2.5c4.8 0 5.7 3.2 5.7 7.4v8.4h-5v-7.5c0-1.8-.1-4.1-2.5-4.1-2.5 0-2.9 2-2.9 4v7.6h-5z" />
              </svg>
            </a>
          </div>
          <p>&copy; 2024 SmartLogistics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}