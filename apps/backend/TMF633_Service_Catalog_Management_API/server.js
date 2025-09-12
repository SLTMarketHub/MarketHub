require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Create app
const app = express();
const port = process.env.PORT || 5005;
const BASE_URL = '/tmf-api/serviceCatalogManagement/v4';

// Import route files
const serviceCatalogRoutes = require('./routes/serviceCatalogRoutes');
const serviceCategoryRoutes = require('./routes/serviceCategoryRoutes');
const serviceCandidateRoutes = require('./routes/serviceCandidateRoutes');
const serviceSpecificationRoutes = require('./routes/serviceSpecificationRoutes');
const importJobRoutes = require('./routes/importJobRoutes');
const exportJobRoutes = require('./routes/exportJobRoutes');

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Health check
app.get('/', (req, res) => {
  res.send('🚀 TMF Service Catalog API with MongoDB is running');
});

app.get(BASE_URL, (req, res) => {
  res.json({
    availableEndpoints: [
      `${BASE_URL}/serviceCatalog`,
      `${BASE_URL}/serviceCategory`,
      `${BASE_URL}/serviceCandidate`,
      `${BASE_URL}/serviceSpecification`,
      `${BASE_URL}/importJob`,
      `${BASE_URL}/exportJob`
    ]
  });
});

// Use routes
app.use(`${BASE_URL}/serviceCatalog`, serviceCatalogRoutes);
app.use(`${BASE_URL}/serviceCategory`, serviceCategoryRoutes);
app.use(`${BASE_URL}/serviceCandidate`, serviceCandidateRoutes);
app.use(`${BASE_URL}/serviceSpecification`, serviceSpecificationRoutes);
app.use(`${BASE_URL}/importJob`, importJobRoutes);
app.use(`${BASE_URL}/exportJob`, exportJobRoutes);

// MongoDB connection
const user = process.env.MONGO_USER;
const password = encodeURIComponent(process.env.MONGO_PW);
const dbName = process.env.MONGO_DB;
const clusterUrl = 'cluster0.mr1gaxu.mongodb.net';

const mongoUri = `mongodb+srv://${user}:${password}@${clusterUrl}/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}${BASE_URL}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });
