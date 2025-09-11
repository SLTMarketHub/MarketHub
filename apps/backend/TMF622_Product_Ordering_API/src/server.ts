import 'dotenv/config';
import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler, notFound } from './middleware/errorHandler';
import productRoutes from './routes/productRoutes';
import { IError } from './types';

console.log('Environment:', process.env.NODE_ENV);
console.log('MongoDB URI:', process.env.MONGODB_URI);
console.log('Starting server...');

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware for development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/products', productRoutes);

// Test route
app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Database connection
console.log('Connecting to MongoDB...');
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/productOrderDB')
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server only after MongoDB connection is established
    const PORT = process.env.PORT || 3001;
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err: Error) => {
      console.error('UNHANDLED REJECTION! 💥 Shutting down...');
      console.error(err.name, err.message);
      if (server) {
        server.close(() => {
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });
  })
  .catch((err: Error) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  process.exit(0);
});
