import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import connectDB from './Config/db.js';
import userRoutes from './Route/userRoute.js';
import authRoutes from './Route/authRoutes.js';
import { errorHandler } from './Middleware/errorMiddleware.js';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import './Config/passport.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.use(errorHandler);

export default app;
