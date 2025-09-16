const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

//billcycle routes
const billCycleRoutes = require('./routes/billCycleRoutes');
app.use('/billCycle', billCycleRoutes);

//customer bill routes
const customerBillRoutes = require('./routes/customerBillRoutes');
app.use('/customerBill', customerBillRoutes);

//customer bill on demand routes
const customerBillOnDemandRoutes = require('./routes/customerBillOnDemandRoutes');
app.use('/customerBillOnDemand', customerBillOnDemandRoutes);

// Applied Customer Billing Rate routes
const appliedCustomerBillingRateRoutes = require('./routes/appliedCustomerBillingRateRoutes');
app.use('/appliedCustomerBillingRate', appliedCustomerBillingRateRoutes);

//notification routes
const notificationRoutes = require('./routes/notificationRoutes');
app.use('/notifications', notificationRoutes);

//hub
const hubRoutes = require('./routes/hubRoutes');
app.use('/hub',hubRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Database connected successfully!');
    console.log('Connected ',mongoose.connection.name);
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
  });

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
