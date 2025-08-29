import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function LandingPage() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      {/* Navigation */}
      <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-extrabold text-indigo-600 tracking-wide">SmartLogistics</h1>
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
                    className="bg-indigo-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
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
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-36 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 animate-fadeInUp">
            Smart Logistics &
            <span className="text-indigo-600 block">Delivery Management</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto animate-fadeInUp delay-150">
            Revolutionize your delivery operations with our intelligent logistics platform.
            Track shipments in real-time, optimize routes, and deliver with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fadeInUp delay-300">
            {!user ? (
              <>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105"
                >
                  Sign In
                </Link>
              </>
            ) : (
              <div className="text-lg text-gray-700">
                You're logged in as a {user.role}
              </div>
            )}
          </div>
        </div>

        {/* Floating Background Shapes */}
        <div className="absolute -top-56 -right-56 w-96 h-96 bg-indigo-100 rounded-full opacity-20 animate-float slow"></div>
        <div className="absolute -bottom-56 -left-56 w-96 h-96 bg-blue-100 rounded-full opacity-20 animate-float slow"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose SmartLogistics?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with user-friendly design to deliver exceptional logistics solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Real-time Tracking",
                desc: "Monitor your shipments in real-time with live GPS tracking and instant status updates.",
                iconBg: "bg-blue-600",
                iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
                cardGradient: "from-blue-50 to-indigo-50"
              },
              {
                title: "Analytics Dashboard",
                desc: "Get comprehensive insights with detailed analytics and performance metrics.",
                iconBg: "bg-green-600",
                iconPath: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                cardGradient: "from-green-50 to-emerald-50"
              },
              {
                title: "Secure & Reliable",
                desc: "Enterprise-grade security with 99.9% uptime guarantee for your peace of mind.",
                iconBg: "bg-purple-600",
                iconPath: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                cardGradient: "from-purple-50 to-indigo-50"
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${feature.cardGradient} p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105`}
              >
                <div className={`w-14 h-14 ${feature.iconBg} rounded-lg flex items-center justify-center mb-4 animate-pulse`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.iconPath} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4 animate-fadeInUp">Ready to Transform Your Logistics?</h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto animate-fadeInUp delay-150">
            Join thousands of businesses already using SmartLogistics to streamline their delivery operations.
          </p>
          {!user && (
            <Link
              to="/signup"
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300 inline-block animate-fadeInUp delay-300"
            >
              Start Your Free Trial
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">SmartLogistics</h3>
          <p className="text-gray-400 mb-6">
            Revolutionizing logistics and delivery management for the modern world.
          </p>
          <p className="text-sm text-gray-500">
            © 2024 SmartLogistics. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Custom Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-fadeInUp { opacity: 0; transform: translateY(20px); animation: fadeInUp 0.8s forwards; }
          @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
          .delay-150 { animation-delay: 0.15s; }
          .delay-300 { animation-delay: 0.3s; }
        `}
      </style>
    </div>
  );
}