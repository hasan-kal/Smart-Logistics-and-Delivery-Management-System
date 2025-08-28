const Shipment = require("../models/Shipment");
const { sendEmail } = require("../utils/email");

// Create shipment
exports.createShipment = async (req, res) => {
  try {
    const { pickupAddress, deliveryAddress, packageType } = req.body;

    const shipment = await Shipment.create({
      customer: req.user.id,
      pickupAddress,
      deliveryAddress,
      packageType,
      status: "Booked",
    });

    res.json(shipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get shipments (Admin sees all, Customer sees own)
exports.getShipments = async (req, res) => {
  try {
    let shipments;
    if (req.user.role === "admin") {
      shipments = await Shipment.find().populate("customer agent", "name email");
    } else {
      shipments = await Shipment.find({ customer: req.user.id });
    }
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel shipment (only if status = Booked)
exports.cancelShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) return res.status(404).json({ msg: "Shipment not found" });

    if (shipment.status !== "Booked")
      return res.status(400).json({ msg: "Cannot cancel after pickup" });

    if (req.user.role !== "admin" && shipment.customer.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    shipment.status = "Cancelled";
    await shipment.save();

    res.json({ msg: "Shipment cancelled", shipment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update shipment status (Agent)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) return res.status(404).json({ msg: "Shipment not found" });
    if (shipment.agent.toString() !== req.user.id)
      return res.status(403).json({ msg: "Not your shipment" });

    if (shipment.customer?.email) {
      await sendEmail(
        shipment.customer.email,
        `Shipment Status Updated`,
        `Your shipment is now: ${status}`
      );
    }

    shipment.status = status;
    await shipment.save();

    res.json(shipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update location (Agent)
exports.updateLocation = async (req, res) => {
  try {
    const { lng, lat } = req.body;
    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) return res.status(404).json({ msg: "Shipment not found" });
    if (shipment.agent.toString() !== req.user.id)
      return res.status(403).json({ msg: "Not your shipment" });

    shipment.location = { type: "Point", coordinates: [lng, lat] };
    await shipment.save();

    res.json({ msg: "Location updated", location: shipment.location });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};