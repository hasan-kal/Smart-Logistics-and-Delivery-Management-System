const express = require("express");
const { createShipment, getShipments, cancelShipment, updateStatus, updateLocation } = require("../controllers/shipmentController");
const auth = require("../middlewares/authMiddleware");

const router = express.Router();

// Customer routes
router.post("/", auth(["customer"]), createShipment);
router.get("/", auth(["customer", "admin"]), getShipments);
router.put("/:id/cancel", auth(["customer", "admin"]), cancelShipment);

// Agent routes
router.put("/:id/status", auth(["agent"]), updateStatus);
router.put("/:id/location", auth(["agent"]), updateLocation);

module.exports = router;