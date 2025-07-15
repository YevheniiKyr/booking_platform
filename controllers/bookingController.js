const { validationResult } = require('express-validator');
const bookingService = require('../services/bookingService');

class BookingController {
    async create(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const booking = await bookingService.createBooking(req.body, req.user._id);

            res.status(201).json({
                success: true,
                message: 'Booking created successfully',
                booking
            });
        } catch (error) {
            const status = error.message === 'Service not found' ? 404 : 400;

            res.status(status).json({
                success: false,
                message: error.message
            });
        }
    }

    async getAll(req, res) {
        try {
            const bookings = await bookingService.getUserBookings(req.user._id, req.user.role);

            res.json({
                success: true,
                bookings
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateStatus(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

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
            const status = error.message === 'Booking not found' ? 404 :
                error.message === 'Access denied' ? 403 : 500;

            res.status(status).json({
                success: false,
                message: error.message
            });
        }
    }

}

module.exports = new BookingController();