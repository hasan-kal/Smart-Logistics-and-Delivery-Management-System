const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pickupAddress: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  packageType: { type: String, required: true },
  status: {
    type: String,
    enum: ['Booked', 'Picked', 'In Transit', 'Delivered', 'Cancelled'],
    default: 'Booked',
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
  },
  route: {
    distance: { type: Number },  // meters
    duration: { type: Number },  // seconds
    geometry: { type: Object },  // GeoJSON line
  },
}, { timestamps: true });

shipmentSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('Shipment', shipmentSchema);