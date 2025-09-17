require("dotenv").config();
const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const cors = require("cors");

const customerRoutes = require("./Routes/CustomerRoutes");
const hubRoutes = require("./Routes/NotificationRoutes");
const EventHub = require("./Models/EventHub");
const clientListenerRoutes = require("./ClientListner");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.DATABASE_URL || process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async () => {
        console.log("✅ MongoDB Connected");

        const count = await EventHub.countDocuments();
        if (count === 0) {
            await EventHub.create({
                // callback: `http://localhost:${process.env.PORT || 3000}/client/listener`,
                callback: `${process.env.BASE_URL || "https://markethub-api-gateway.onrender.com"}/client/listener`,
            });
            console.log(
                `📌 Default listener registered at ${process.env.BASE_URL || "https://markethub-api-gateway.onrender.com"}/client/listener`
            );
        } else {
            console.log("ℹ️ EventHub already has registered listeners.");
        }
    })
    .catch((err) => console.error("❌ Mongo Error:", err));

app.use("/customer", customerRoutes);
app.use("/hub", hubRoutes);

clientListenerRoutes(app);

app.get("/", async (_req, res) => {
    try {
        const response = await axios.get(
            `${process.env.BASE_URL || "https://markethub-api-gateway.onrender.com"}/tmf-api/customer/v5/customer`
        );

        res.send(`
      <h2>Customer Management API</h2>
      <h3>Default EventHub Listener</h3>
      <p>📡 Callback URL: <strong>${process.env.BASE_URL || "https://markethub-api-gateway.onrender.com"}/client/listener</strong></p>
      <h3>Customer Records</h3>
      <pre>${JSON.stringify(response.data, null, 2)}</pre>
    `);
    } catch (error) {
        console.error("Failed to load customer data:", error.message);
        res.status(500).send("Error loading customer data");
    }
});

const PORT = process.env.PORT || 3000;
const BASE = process.env.BASE_URL || "https://markethub-api-gateway.onrender.com"
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`BASE URL : ${BASE}`);
    console.log(`API Path: /tmf-api/customer/v5/customer`);
    console.log(`🎧 Client listener available at ${BASE}/client/listener`);
});
