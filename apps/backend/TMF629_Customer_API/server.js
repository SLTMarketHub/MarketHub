const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const customerRoutes = require('./Routes/CustomerRoutes');
const hubRoutes = require('./Routes/NotificationRoutes');
const EventHub = require('./Models/EventHub');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ Mongo Error:", err));


app.use("/customer", customerRoutes);
app.use("/hub", hubRoutes);

app.get("/", (_req, res) => {
    res.send(`<h2>EventHub API</h2><p>POST events to <strong>/hub</strong></p><p>GET all events from <strong>/hub</strong></p>`);
});

const PORT = process.env.PORT || 3000;
const BASE = process.env.BASE_URL || "https://markethub-api-gateway.onrender.com"
app.listen(PORT, () =>{
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`BASE URL : ${BASE}`)
});
