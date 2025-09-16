import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

// Import routes
import productOrderRoutes from './routes/productOrderRoutes.js';
import cancelProductOrderRoutes from './routes/cancelProductOrderRoutes.js';
import hubRoutes from './routes/hubRoutes.js';

// Import error handler middleware
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(json());

// Routes
app.use('/productOrder', productOrderRoutes);
app.use('/cancelProductOrder', cancelProductOrderRoutes);
app.use('/hub', hubRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);

// MongoDB connection and server start
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });