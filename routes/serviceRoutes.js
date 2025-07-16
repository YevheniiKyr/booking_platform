const express = require('express');
const serviceController = require('../controllers/serviceController');
const { auth, checkRole } = require('../middlewares/authMiddleware');
const Roles = require("../consts/roles");
const {serviceSchema} = require("../validators/service.validator");
const validate = require("../middlewares/validate");
const validateParamsId = require("../middlewares/validateParamsId");
const router = express.Router();

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
