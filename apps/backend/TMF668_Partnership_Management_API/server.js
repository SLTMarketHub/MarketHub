// server.js
// Entry point for TMF668 Partnership Management API

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

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

// Base API path (TMF Forum standard)
const BASE_PATH = '/tmf-api/partnershipManagement/v4';

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TMF668 Partnership Management API',
      version: '4.0.0',
      description: 'TMF668 Partnership Management API - TM Forum compliant',
    },
    servers: [
      { url: `http://localhost:${PORT}${BASE_PATH}`, description: 'Development server' }
    ],
  },
  apis: ['./routes/*.js'], // Look for Swagger docs in routes
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Import route files
const partnershipSpecificationRoutes = require('./routes/partnershipSpecification');
const partnershipRoutes = require('./routes/partnership');
const hubRoutes = require('./routes/hub');

// Mount routers under correct subpaths
app.use(`${BASE_PATH}/partnershipSpecification`, partnershipSpecificationRoutes);
app.use(`${BASE_PATH}/partnership`, partnershipRoutes);
app.use(`${BASE_PATH}/hub`, hubRoutes);

// Health check endpoint (TMF Forum standard)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'TMF668 Partnership Management API',
    version: '4.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'TMF668 Partnership Management API is running!',
    documentation: `http://localhost:${PORT}/api-docs`,
    health: `http://localhost:${PORT}/health`,
    baseEndpoint: `http://localhost:${PORT}${BASE_PATH}`
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

// 404 handler for undefined routes
app.use('*', (req, res) => {
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
  console.log(`📖 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔗 Base API Path: http://localhost:${PORT}${BASE_PATH}`);
});

module.exports = app;