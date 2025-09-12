import express from "express";
import * as ctrl from "../controllers/communicationController.js";
const router = express.Router();


router.get("/", ctrl.listMessages);
router.get("/:id", ctrl.getMessage);
router.post("/", ctrl.createMessage);
router.patch("/:id", ctrl.patchMessage);
router.delete("/:id", ctrl.deleteMessage);
router.post("/:id/send", ctrl.sendMessageNow);


export default router;