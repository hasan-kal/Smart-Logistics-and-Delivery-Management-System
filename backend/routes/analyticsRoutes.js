import express from "express";
import { getOverview, getTrends } from "../controllers/analyticsController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin-only endpoints
router.get("/overview", authMiddleware, getOverview);
router.get("/trends", authMiddleware, getTrends);

export default router;