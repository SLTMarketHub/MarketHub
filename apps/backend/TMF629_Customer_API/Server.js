require("dotenv").config();
const express = require("express");
const axios = require('axios');
const mongoose = require("mongoose");
const cors = require("cors");

const customerRoutes = require("./routes/CustomerRoute");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("Mongo Error:", err));

app.use("/tmf-api/customerManagement/v5/customer", customerRoutes);

app.get('/', async (_req, res) => {
    try {
        const response = await axios.get(`https://tmf629-production.up.railway.app/tmf-api/customerManagement/v5/customer`);

        res.send(`
      <h2>Customer Management API</h2>
      <pre>${JSON.stringify(response.data, null, 2)}</pre>
    `);
    } catch (error) {
        console.error('Failed to load customer data:', error.message);
        res.status(500).send('Error loading customer data');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
