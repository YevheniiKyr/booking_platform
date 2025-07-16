const express = require('express');
const availabilityController = require('../controllers/availabilityController');
const {availabilityQueryParamsSchema} = require('../validators/availability.query.validator');
const validateQueryParams = require('../middlewares/validateQueryParams');
const router = express.Router();

router.get('/', validateQueryParams(availabilityQueryParamsSchema), availabilityController.getProviderAvailability);

module.exports = router;