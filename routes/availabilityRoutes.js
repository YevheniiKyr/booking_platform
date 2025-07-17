const express = require('express');
const availabilityController = require('../controllers/availabilityController');
const {availabilityQueryParamsSchema} = require('../validators/availability.query.validator');
const validateQueryParams = require('../middlewares/validateQueryParams');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Availability
 *   description: Availability management
 */

/**
 * @swagger
 * /api/availability:
 *   get:
 *     summary: Get provider availability
 *     tags: [Availability]
 *     parameters:
 *       - in: query
 *         name: providerId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the provider
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Date in YYYY-MM-DDTHH:mm:ss.sssZ format
 *     responses:
 *       200:
 *         description: List of available time slots
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AvailabilityResponse'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.get('/', validateQueryParams(availabilityQueryParamsSchema), availabilityController.getProviderAvailability);

module.exports = router;