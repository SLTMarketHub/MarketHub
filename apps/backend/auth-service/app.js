require('dotenv').config();
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./Config/db');
const userRoutes = require('./Route/userRoute');
const authRoutes = require('./Route/authRoutes')
const { errorHandler } = require('./Middleware/errorMiddleware');
const passport = require('passport');
const cookieParser = require('cookie-parser');
require('./Config/passport');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();

app.use(cors({origin: process.env.FRONTEND_URL, credentials: true}));
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.use(errorHandler);

module.exports = app;
