const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String }, // for admin & customer
  phone: { type: String }, // for OTP login (agent)
  role: { type: String, enum: ['customer', 'agent', 'admin'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);