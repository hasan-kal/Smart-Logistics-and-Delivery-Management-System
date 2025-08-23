const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  zoneName: { type: String, required: true },
  postalCodes: [String],
});

module.exports = mongoose.model('DeliveryZone', zoneSchema);