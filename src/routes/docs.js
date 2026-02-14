
/**
 * @file docs routes (Swagger UI)
 */
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const swaggerPath = path.join(__dirname, '..', 'swagger', 'openapi.json');
const spec = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

router.use('/', swaggerUi.serve, swaggerUi.setup(spec));

module.exports = router;
