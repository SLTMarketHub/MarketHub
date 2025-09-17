import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();
const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Auth Service
app.use("/tmf-api/authService", createProxyMiddleware({
  target: process.env.AUTH_URL || "http://localhost:5001",
  changeOrigin: true,
  cookieDomainRewrite: process.env.FRONTEND_URL,
  secure: true,
  pathRewrite: {
    '^/tmf-api/authService': ''
  }
}));

// TMF620 - Product Catalog API
app.use("/tmf-api/productCatalog/v5", createProxyMiddleware({
  target: process.env.TMF620_URL || "http://localhost:5002",
  changeOrigin: true
}));

// TMF622 - Product Ordering API
app.use("/tmf-api/productOrdering/v1", createProxyMiddleware({
  target: process.env.TMF622_URL || "http://localhost:5003",
  changeOrigin: true
}));

// TMF629 - Customer API
app.use("/tmf-api/customer/v5", createProxyMiddleware({
  target: process.env.TMF629_URL || "http://localhost:5004",
  changeOrigin: true
}));

// TMF633 - Service Catalog Management API
app.use("/tmf-api/serviceCatalogManagement/v4", createProxyMiddleware({
  target: process.env.TMF633_URL || "http://localhost:5005",
  changeOrigin: true
}));

// TMF668 - Partnership Management API
app.use("/tmf-api/partnershipManagement/v4", createProxyMiddleware({
  target: process.env.TMF668_URL || "http://localhost:5006",
  changeOrigin: true
}));

// TMF678 - Customer Bill API
app.use("/tmf-api/customerBill/v5", createProxyMiddleware({
  target: process.env.TMF678_URL || "http://localhost:5007",
  changeOrigin: true
}));

// TMF681 - Communication Management API
app.use("/tmf-api/communicationManagement/v4", createProxyMiddleware({
  target: process.env.TMF681_URL || "http://localhost:5008",
  changeOrigin: true
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 TM Forum API Gateway running on port ${PORT}`);
});
