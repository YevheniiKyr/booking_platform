const express = require('express');
const { body } = require('express-validator');
const serviceController = require('../controllers/serviceController');
const { auth, checkRole } = require('../middlewares/authMiddleware');
const Roles = require("../consts/roles");
const {serviceSchema} = require("../validators/service.validator");
const validate = require("../middlewares/validate");

const router = express.Router();

router.post(
    '/',
    auth,
    //remove client after testing
    checkRole([Roles.Provider, Roles.Client]),
    validate(serviceSchema),
    serviceController.create
);

router.get('/', serviceController.getAll);

router.get('/:id', serviceController.getById);


module.exports = router;
