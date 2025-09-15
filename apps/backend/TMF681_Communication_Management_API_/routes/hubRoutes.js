import express from "express";
import { registerHub, unregisterHub } from "../controllers/hubController.js";
const router = express.Router();


router.post("/", registerHub);
router.delete("/:id", unregisterHub);


export default router;