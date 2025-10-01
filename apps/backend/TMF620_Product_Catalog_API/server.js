const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/tmf-api/', limiter);

// CORS configuration
//app.use(cors());
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static serving for uploaded files
const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Logging middleware
app.use(morgan('combined'));

// Database connection
mongoose.connect(process.env.MONGODB_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/category', require('./routes/categories'));
app.use('/importJob', require('./routes/importJobs'));
app.use('/exportJob', require('./routes/exportJobs'));
app.use('/productCatalog', require('./routes/productCatalog'));
app.use('/productOffering', require('./routes/productOfferings'));
app.use('/productSpecification', require('./routes/productSpecifications'));
app.use('/productOfferingPrice', require('./routes/productOfferingPrice'));
app.use('/hub', require('./routes/hubRoutes'));


// Serve docs PDF under /api/v1/docs
const docsPdfPath = path.join(__dirname, '..', '..', '..', 'docs', 'API docs', 'TMF620_Product_Catalog_userguide.pdf');
app.get('/tmf-api/productCatalog/v5/docs', (req, res) => {
  res.sendFile(docsPdfPath, err => {
    if (err) {
      res.status(500).json({ error: 'Unable to serve documentation PDF' });
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'TMF620 Product Catalog API',
    version: '5.0.0',
    baseUrl: 'https://markethub-api-gateway.onrender.com'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'TMF620 Product Catalog API',
    version: '5.0.0',
    baseUrl: 'https://markethub-api-gateway.onrender.com',
    apiPath: '/tmf-api/productCatalog/v5',
    documentation: '/tmf-api/productCatalog/v5/docs',
    health: '/health',
    endpoints: {
      category: '/tmf-api/productCatalog/v5/category',
      importJob: '/tmf-api/productCatalog/v5/importJob',
      exportJob: '/tmf-api/productCatalog/v5/exportJob',
      productCatalog: '/tmf-api/productCatalog/v5/productCatalog',
      productOffering: '/tmf-api/productCatalog/v5/productOffering',
      productSpecification: '/tmf-api/productCatalog/v5/productSpecification',      
      productOfferingPrice: '/tmf-api/productCatalog/v5/productOfferingPrice',
      hub: '/tmf-api/productCatalog/v5/hub'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`TMF620 Product Catalog API v5 server running on port ${PORT}`);
  console.log(`Base URL: https://markethub-api-gateway.onrender.com`);
  console.log(`API Path: /tmf-api/productCatalog/v5`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
