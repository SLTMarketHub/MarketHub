import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import productRoutes from './routes/productRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware for development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes (mirror TMF681 base path style)
app.use('/tmf-api/productOrdering/v1', productRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Database connection and server start
const MONGODB_URI = process.env.MONGODB_URI ;
const PORT = process.env.PORT || 3001;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err);
  process.exit(1);
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully');
  process.exit(0);
});


