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
                callback: `http://localhost:${process.env.PORT || 3000}/client/listener`,
            });
            console.log(
                `📌 Default listener registered at http://localhost:${process.env.PORT || 3000}/client/listener`
            );
        } else {
            console.log("ℹ️ EventHub already has registered listeners.");
        }
    })
    .catch((err) => console.error("❌ Mongo Error:", err));

app.use("/tmf-api/customerManagement/v5/customer", customerRoutes);
app.use("/api/hub", hubRoutes);

clientListenerRoutes(app);

app.get("/", async (_req, res) => {
    try {
        const response = await axios.get(
            `http://localhost:${process.env.PORT || 3000}/tmf-api/customerManagement/v5/customer`
        );

        res.send(`
      <h2>Customer Management API</h2>
      <h3>Default EventHub Listener</h3>
      <p>📡 Callback URL: <strong>http://localhost:${process.env.PORT || 3000}/client/listener</strong></p>
      <h3>Customer Records</h3>
      <pre>${JSON.stringify(response.data, null, 2)}</pre>
    `);
    } catch (error) {
        console.error("Failed to load customer data:", error.message);
        res.status(500).send("Error loading customer data");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🎧 Client listener available at http://localhost:${PORT}/client/listener`);
});
