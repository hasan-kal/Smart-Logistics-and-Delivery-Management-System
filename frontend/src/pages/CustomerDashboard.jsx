import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";
import ShipmentMap from "../components/ShipmentMap";
import RouteMap from "../components/RouteMap";
import { toast } from "react-hot-toast";

export default function CustomerDashboard() {
  const { token } = useContext(AuthContext);
  const [shipments, setShipments] = useState([]);
  const [form, setForm] = useState({
    pickupAddress: "",
    deliveryAddress: "",
    packageType: ""
  });

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
    const socket = io("http://localhost:5001");

    socket.on("agentLocationUpdated", (data) => {
      setShipments((prev) =>
        prev.map((s) =>
          s._id === data.id
            ? { ...s, location: { coordinates: [data.lng, data.lat] } }
            : s
        )
      );
    });

    socket.on("shipmentStatusUpdated", (data) => {
      toast.info(`Shipment ${data.id} status updated to ${data.status}`);
      setShipments((prev) =>
        prev.map((s) => (s._id === data.id ? { ...s, status: data.status } : s))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/shipments", form, {
      headers: { "x-auth-token": token },
    });
    setForm({ pickupAddress: "", deliveryAddress: "", packageType: "" });
    fetchShipments();
  };

  const cancelShipment = async (id) => {
    await api.put(`/shipments/${id}/cancel`, {}, {
      headers: { "x-auth-token": token },
    });
    fetchShipments();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Shipments</h1>
            <p className="text-gray-200 mt-1">Manage and track your deliveries</p>
          </div>
          <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">Customer Dashboard</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Create Shipment Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-lg mr-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Create New Shipment</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pickup */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Address</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter pickup location"
                    value={form.pickupAddress}
                    onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter delivery location"
                    value={form.deliveryAddress}
                    onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Package Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Package Type</label>
              <select
                value={form.packageType}
                onChange={(e) => setForm({ ...form, packageType: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white appearance-none"
                required
              >
                <option value="">Select package type</option>
                <option value="Document">Document</option>
                <option value="Small Package">Small Package</option>
                <option value="Medium Package">Medium Package</option>
                <option value="Large Package">Large Package</option>
                <option value="Fragile">Fragile Item</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 flex items-center shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Shipment
              </button>
            </div>
          </form>
        </div>

        {/* Shipments List */}
        <div className="space-y-6">
          {shipments.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No shipments yet. Create one above!</div>
          ) : (
            shipments.map((s) => (
              <div key={s._id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                  <div className="flex-1 space-y-2">
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      s.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      s.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                      s.status === 'Picked' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {s.status}
                    </div>
                    <p className="text-sm text-gray-500">ID: {s._id.slice(-8)}</p>
                    <p className="text-gray-900 font-medium">From: {s.pickupAddress}</p>
                    <p className="text-gray-900 font-medium">To: {s.deliveryAddress}</p>
                    <p className="text-gray-500 text-sm">Package: {s.packageType}</p>

                    {(s.route || s.location) && (
                      <div className="mt-4 rounded-xl shadow-inner overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                        {s.route ? <RouteMap route={s.route} /> : <ShipmentMap location={s.location} />}
                      </div>
                    )}
                  </div>

                  <div>
                    {s.status === "Booked" && (
                      <button
                        onClick={() => cancelShipment(s._id)}
                        className="inline-flex items-center px-4 py-2 text-red-700 border border-red-300 rounded-md bg-white hover:bg-red-50 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}