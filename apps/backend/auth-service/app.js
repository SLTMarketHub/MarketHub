import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import connectDB from './Config/db.js';
import userRoutes from './Route/userRoute.js';
import authRoutes from './Route/authRoutes.js';
import { errorHandler } from './Middleware/errorMiddleware.js';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import './Config/passport.js';
import cors from 'cors';

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Error handler
app.use(errorHandler);

export default app;

