const express = require('express');
const availabilityController = require('../controllers/availabilityController');
const {availabilitySchema} = require("../validators/availaility.validator");
const validate = require("../middlewares/validate");

const router = express.Router();

router.get('/', validate(availabilitySchema), availabilityController.getProviderAvailability);

module.exports = router;
