import express from "express";
import { registerHub, unregisterHub } from "../controllers/hubController.js";
const router = express.Router();


router.post("/api/hub", registerHub);
router.delete("/api/hub/:id", unregisterHub);


export default router;