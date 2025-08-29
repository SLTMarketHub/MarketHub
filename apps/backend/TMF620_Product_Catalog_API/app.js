const express = require('express');
const app = express();
const connectDB = require('./config/db');
require('dotenv').config();
const path = require('path');

// Connect to DB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // ✅ Serve files in /public

// Log POST payloads
app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log(`\n📥 Incoming POST request to ${req.originalUrl}`);
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// ✅ Serve your UI
app.get('/', (req, res) => {
  console.log('🔵 Root route hit');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API routes
const importJobRoutes = require('./routes/importJobRoutes');
const exportJobRoutes = require('./routes/exportJobRoutes');
const productCatalogRoutes = require('./routes/productCatalogRoutes');
const productOfferingRoutes = require('./routes/productOfferingRoutes');
const productSpecificationRoutes = require('./routes/productSpecificationRoutes');
const productOfferingPriceRoutes = require('./routes/productOfferingPriceRoutes');

app.use('/api', importJobRoutes);
app.use('/api', exportJobRoutes);
app.use('/api', productCatalogRoutes);
app.use('/api', productOfferingRoutes);
app.use('/api', productSpecificationRoutes);
app.use('/api', productOfferingPriceRoutes);

// Port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
