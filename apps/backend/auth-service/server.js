import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3050;
const BASE = process.env.BASE_URL || "https://markethub-api-gateway.onrender.com";

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
  console.log(`BASE URL: ${BASE}`);
});

