require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
<<<<<<< HEAD
const port = process.env.PORT || 3000;
=======
const port = process.env.PORT || 5005;
const BASE_URL = '/tmf-api/serviceCatalogManagement/v4';
>>>>>>> 77e65f84a76cb2f4080e678e1bec853915eeab69

app.use(express.json());
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

// Import routes
const serviceCatalogRoutes = require('./routes/serviceCatalogRoutes');
const serviceCategoryRoutes = require('./routes/serviceCategoryRoutes');
const serviceCandidateRoutes = require('./routes/serviceCandidateRoutes');
const serviceSpecificationRoutes = require('./routes/serviceSpecificationRoutes');
const importJobRoutes = require('./routes/importJobRoutes');
const exportJobRoutes = require('./routes/exportJobRoutes');

// Mount routes at CTK expected paths
app.use('/serviceCatalog', serviceCatalogRoutes);
app.use('/serviceCategory', serviceCategoryRoutes);
app.use('/serviceCandidate', serviceCandidateRoutes);
app.use('/serviceSpecification', serviceSpecificationRoutes);
app.use('/importJob', importJobRoutes);
app.use('/exportJob', exportJobRoutes);



const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(port, () => {
      console.log(`🚀 Server running at port:${port}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });
