// server.js
// Entry point for TMF668 Partnership Management API

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Import route files
const partnershipSpecificationRoutes = require('./routes/partnershipSpecification');
const partnershipRoutes = require('./routes/partnership');
const hubRoutes = require('./routes/hub');

// Mount routers under correct subpaths
app.use(`/partnershipSpecification`, partnershipSpecificationRoutes);
app.use(`/partnership`, partnershipRoutes);
app.use(`/hub`, hubRoutes);

// Health check endpoint (TMF Forum standard)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'TMF668 Partnership Management API',
    version: '4.0.0'
  });
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An internal server error occurred',
      timestamp: new Date().toISOString()
    }
  });
});

// 404 handler for undefined routes - Express v5 compatible
app.use((req, res, next) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Endpoint ${req.method} ${req.originalUrl} not found`,
      timestamp: new Date().toISOString()
    }
  });
});

// Graceful shutdown handling
process.on('SIGINT', () => {
  console.log('Received SIGINT. Graceful shutdown...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TMF668 Partnership Management API started on port ${PORT}`);
});

module.exports = app;