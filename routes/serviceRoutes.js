const express = require('express');
const serviceController = require('../controllers/serviceController');
const { auth, checkRole } = require('../middlewares/authMiddleware');
const Roles = require("../consts/roles");
const {serviceSchema} = require("../validators/service.validator");
const validate = require("../middlewares/validate");
const validateParamsId = require("../middlewares/validateParamsId");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Service
 *   description: Service management
 */

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create new service
 *     tags: [Service]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiceCreate'
 *     responses:
 *       201:
 *         description: Successful service creation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
    '/',
    auth,
    checkRole([Roles.Provider]),
    validate(serviceSchema),
    serviceController.create
);

router.get('/', serviceController.getAll);

router.get('/:id', validateParamsId(),  serviceController.getById);


module.exports = router;
