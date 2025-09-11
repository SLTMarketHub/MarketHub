// server.js
// Entry point for TMF668 Partnership Management API








const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

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



// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TMF668 Partnership Management API',
      version: '1.0.0',
      description: 'API documentation for TMF668 Partnership Management',
    },
    servers: [
      { url: 'http://localhost:5000' }
    ],
  },
  apis: ['./routes/*.js'], // Path to route files for annotation
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Import and use PartnershipSpecification routes
// All endpoints will be available under /partnershipSpecification
const partnershipSpecificationRoutes = require('./routes/partnershipSpecification');
app.use('/partnershipSpecification', partnershipSpecificationRoutes);

// Import and use Partnership routes
// All endpoints will be available under /partnership
const partnershipRoutes = require('./routes/partnership');
app.use('/partnership', partnershipRoutes);

// Test route to verify server is running
app.get('/', (req, res) => {
  res.send('TMF668 Partnership Management API is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
