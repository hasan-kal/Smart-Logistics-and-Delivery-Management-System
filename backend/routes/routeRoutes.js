const express = require("express");
const { getOptimizedRoute } = require("../controllers/routeController");
const auth = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/optimize", auth(), getOptimizedRoute);

module.exports = router;