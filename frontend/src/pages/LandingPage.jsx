import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function LandingPage() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-indigo-600 tracking-wide">
                SmartLogistics
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-300"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <div className="text-gray-700 font-medium">
                  Welcome back, {user.name}!
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-32 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Smart Logistics & Delivery Management
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Revolutionize your delivery operations with our intelligent logistics platform. Track shipments in real-time, optimize routes, and deliver with confidence.
        </p>
        {!user ? (
          <div className="flex justify-center space-x-4">
            <Link
              to="/signup"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-indigo-700 transition-colors duration-300"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="text-indigo-600 px-6 py-3 rounded-md text-lg font-semibold border border-indigo-600 hover:bg-indigo-50 transition-colors duration-300"
            >
              Sign In
            </Link>
          </div>
        ) : (
          <p className="text-gray-700 text-lg">You're logged in as a {user.role}.</p>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Tracking</h3>
            <p className="text-gray-600">
              Monitor your shipments live with GPS tracking and instant updates.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics Dashboard</h3>
            <p className="text-gray-600">
              Gain insights with detailed analytics and performance metrics.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Reliable</h3>
            <p className="text-gray-600">
              Enterprise-grade security and 99.9% uptime for peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="bg-indigo-600 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Transform Your Logistics?
            </h2>
            <Link
              to="/signup"
              className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Start Your Free Trial
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">SmartLogistics</h3>
          <div className="flex justify-center space-x-6 mb-6">
            <a
              href="#"
              className="hover:text-white transition-colors duration-300"
              aria-label="Twitter"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 19c7 0 10-6 10-10v-.5A7.1 7.1 0 0020 6a7 7 0 01-2 1 3.5 3.5 0 001.5-2 7 7 0 01-2 1 3.5 3.5 0 00-6 3 10 10 0 01-7-3 3.5 3.5 0 001 5 3.5 3.5 0 01-1.5-.5v.1a3.5 3.5 0 002.8 3.5 3.5 3.5 0 01-1.5.1 3.5 3.5 0 003.3 2.5A7 7 0 018 19" />
              </svg>
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors duration-300"
              aria-label="GitHub"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2a10 10 0 00-3 19.5c.5.1.7-.2.7-.5v-2c-3 .7-3.7-1.4-3.7-1.4a2.9 2.9 0 00-1.3-1.8c-1-.7.1-.7.1-.7a2.3 2.3 0 011.7 1.2 2.4 2.4 0 003.3 1 2.4 2.4 0 01.7-1.5c-2.4-.3-5-1.2-5-5.3a4.1 4.1 0 011-2.8 3.8 3.8 0 01.1-2.7s.8-.3 2.8 1a9.4 9.4 0 015 0c2-.1 2.8-1 2.8-1a3.8 3.8 0 01.1 2.7 4 4 0 011 2.8c0 4.1-2.6 5-5 5.3a2.7 2.7 0 01.8 2v3c0 .3.2.6.7.5A10 10 0 0012 2z" />
              </svg>
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.94 6.94A2.06 2.06 0 115 5a2.06 2.06 0 011.94 1.94zM4 8.5h5v12H4zM9.5 8.5h4.5v1.7h.1a5 5 0 014.5-2.5c4.8 0 5.7 3.2 5.7 7.4v8.4h-5v-7.5c0-1.8-.1-4.1-2.5-4.1-2.5 0-2.9 2-2.9 4v7.6h-5z" />
              </svg>
            </a>
          </div>
          <p className="text-sm">&copy; 2024 SmartLogistics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}