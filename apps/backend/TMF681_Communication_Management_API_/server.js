import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import communicationRoutes from "./routes/communicationRoutes.js";
import hubRoutes from "./routes/hubRoutes.js";
import { startScheduler } from "./services/scheduler.js";


dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());


app.use("/communicationMessage", communicationRoutes);
app.use("/hub", hubRoutes);


const PORT = process.env.PORT || 5008;


mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected");
        startScheduler();
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });