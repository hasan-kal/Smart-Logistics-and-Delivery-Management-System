const express = require("express");
const { createShipment, getShipments, cancelShipment } = require("../controllers/shipmentController");
const auth = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", auth(["customer"]), createShipment);
router.get("/", auth(["customer", "admin"]), getShipments);
router.put("/:id/cancel", auth(["customer", "admin"]), cancelShipment);

module.exports = router;