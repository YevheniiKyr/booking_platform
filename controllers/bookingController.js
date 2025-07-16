const { validationResult } = require('express-validator');
const bookingService = require('../services/bookingService');

class BookingController {
    async create(req, res, next) {
        try {
            const booking = await bookingService.createBooking(req.body, req.user._id);

            res.status(201).json({
                success: true,
                message: 'Booking created successfully',
                booking
            });
        } catch (error) {
            next(error)
        }
    }

    async updateStatus(req, res, next) {
        try {
            const { status } = req.body;
            const booking = await bookingService.updateBookingStatus(
                req.params.id,
                status,
                req.user._id
            );

            res.json({
                success: true,
                message: `Booking ${status} successfully`,
                booking
            });
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new BookingController();