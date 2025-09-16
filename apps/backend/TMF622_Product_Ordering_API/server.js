import dotenv from "dotenv";
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Import routes
import productOrderRoutes from './routes/productOrderRoutes.js';
import cancelProductOrderRoutes from './routes/cancelProductOrderRoutes.js';
import hubRoutes from './routes/hubRoutes.js';



dotenv.config();
console.log("MONGO_URI:", process.env.MONGO_URI); // Debug check

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/productOrder', productOrderRoutes);
app.use('/cancelProductOrder', cancelProductOrderRoutes);
app.use('/hub', hubRoutes);



// MongoDB connection and server start
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });