require('dotenv').config();
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./Config/db');
const userRoutes = require('./Route/userRoute');
const { errorHandler } = require('./Middleware/errorMiddleware');
const passport = require('passport');
const cookieParser = require('cookie-parser');
require('./Config/passport');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/tmf-api/auth', require('./Route/authRoutes'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use('/tmf-api/users', userRoutes);

app.use(errorHandler);

module.exports = app;
