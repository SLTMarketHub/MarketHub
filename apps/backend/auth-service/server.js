import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();
const PORT = process.env.PORT || 5000;
const BASE = process.env.BASE_URL || "https://markethub-api-gateway.onrender.com";

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

