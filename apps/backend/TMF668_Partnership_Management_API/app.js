const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const partnershipSpecificationRoutes = require('./API/routes/partnershipSpecification');
const partnershipRoutes = require('./API/routes/partnership');
const hubRoutes = require('./API/routes/hub');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ type: ['application/json', 'application/merge-patch+json'] }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

const BASE_URL = process.env.BASE_URL || '/tmf-api/partnershipManagement/v4';
const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'openapi.yaml'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(`${BASE_URL}/partnershipSpecification`, partnershipSpecificationRoutes);
app.use(`${BASE_URL}/partnership`, partnershipRoutes);
app.use(`${BASE_URL}/hub`, hubRoutes);

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

module.exports = app;
