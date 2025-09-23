import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/landingpage.css";
import heroImage from "../assets/hero.jpg";

export default function LandingPage() {
  const { user } = useContext(AuthContext);

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="navbar">
        <div>
          <div>
            <div>
              <h1 className="navbar-title">
                SmartLogistics
              </h1>
            </div>
            <div className="navbar-links">
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
      <section className="hero">
        <h1>
          Smart Logistics & Delivery Management
        </h1>
        <p>
          Revolutionize your delivery operations with our intelligent logistics platform. Track shipments in real-time, optimize routes, and deliver with confidence.
        </p>
        <img src={heroImage} alt="Smart logistics illustration" className="hero-image" />
        {!user ? (
          <div className="hero-buttons">
            <Link
              to="/signup"
              className="btn-primary"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="btn-outline"
            >
              Sign In
            </Link>
          </div>
        ) : (
          <p>You're logged in as a {user.role}.</p>
        )}
      </section>

      {/* Features Section */}
      <section className="features">
        <div>
          <div className="feature-card">
            <img 
              src="https://img.icons8.com/ios-filled/100/000000/delivery.png"
              alt="Real-time Tracking"
              className="feature-icon"
            />
            <h3>Real-time Tracking</h3>
            <p>
              Monitor your shipments live with GPS tracking and instant updates.
            </p>
          </div>
          <div className="feature-card">
            <img 
              src="https://img.icons8.com/ios-filled/100/000000/combo-chart--v1.png"
              alt="Analytics Dashboard"
              className="feature-icon"
            />
            <h3>Analytics Dashboard</h3>
            <p>
              Gain insights with detailed analytics and performance metrics.
            </p>
          </div>
          <div className="feature-card">
            <img 
              src="https://img.icons8.com/ios-filled/100/000000/shield.png"
              alt="Secure & Reliable"
              className="feature-icon"
            />
            <h3>Secure & Reliable</h3>
            <p>
              Enterprise-grade security and 99.9% uptime for peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="cta">
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
      <footer className="footer">
        <div>
          <h3 className="footer-title">SmartLogistics</h3>
          <p>&copy; 2025 SmartLogistics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}