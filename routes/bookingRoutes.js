const express = require('express');
const bookingController = require('../controllers/bookingController');
const {auth, checkRole} = require('../middlewares/authMiddleware');
const {Roles} = require("../consts/roles");
const {bookingSchema, updateBookingSchema} = require("../validators/booking.validator");
const validate = require("../middlewares/validate");
const router = express.Router();

router.post(
    '/',
    auth,
    checkRole([Roles.Client]),
    validate(bookingSchema),
    bookingController.create
)

router.get('/', auth, bookingController.getAll);

router.put(
    '/:id/status',
    auth,
    checkRole([Roles.Provider]),
    validate(updateBookingSchema),
    bookingController.updateStatus
);

module.exports = router;