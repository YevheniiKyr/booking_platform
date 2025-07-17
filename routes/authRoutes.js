const express = require('express');
const authController = require('../controllers/authController');
const { auth } = require('../middlewares/authMiddleware');
const {registerSchema, loginSchema, refreshSchema, logoutSchema} = require("../validators/auth.validator");
const validate = require("../middlewares/validate");
const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);

router.post('/login', validate(loginSchema), authController.login);

router.post('/refresh', authController.refresh);

router.post('/logout', auth, authController.logout);

module.exports = router;
