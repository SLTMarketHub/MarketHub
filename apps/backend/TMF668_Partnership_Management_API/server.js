// server.js
// Entry point for TMF668 Partnership Management API







const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Import and use PartnershipSpecification routes
// All endpoints will be available under /partnershipSpecification
const partnershipSpecificationRoutes = require('./routes/partnershipSpecification');
app.use('/partnershipSpecification', partnershipSpecificationRoutes);

// Test route to verify server is running
app.get('/', (req, res) => {
  res.send('TMF668 Partnership Management API is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
