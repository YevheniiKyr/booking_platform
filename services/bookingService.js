const Booking = require('../models/Booking');
const Service = require('../models/Service');
const AvailabilityService = require('../services/availabilityService');
const ApiError = require('../exceptions/apiError');
const BookingStatuses = require("../consts/bookingStatuses");

class BookingService {

    sendEmailNotification(type, booking) {
        const email = booking.client.email;
        const service = booking.service.name
        const messages = {
            [BookingStatuses.Pending]: `📧 Email to ${email}: Your booking for ${service} has been created and is pending confirmation.`,
            [BookingStatuses.Confirmed]: `📧 Email to ${email}: Your booking for ${service} has been confirmed!`,
            [BookingStatuses.Canceled]: `📧 Email to ${email}: Your booking for ${service} has been cancelled.`
        };
    }


    async createBooking(bookingData, clientId) {
        const { serviceId, startTime } = bookingData;

        const service = await Service.findById(serviceId).populate('provider');
        if (!service) {
            throw ApiError.NotFoundError('Service not found');
        }
        if(!service.isActive) {
            throw ApiError.BadRequestError('Service is not currently available');
        }

        const start = new Date(startTime);
        const end = new Date(start.getTime() + service.duration * 60000);

        const isAvailable = await AvailabilityService.isAvailable(service.provider._id, start, end);
        if (!isAvailable) {
            throw ApiError.BadRequestError('Provider is not available at this time');
        }

        const booking = new Booking({
            service: serviceId,
            client: clientId,
            provider: service.provider._id,
            startTime: start,
            endTime: end,
            totalPrice: service.price
        });

        await booking.save();

        this.sendEmailNotification(BookingStatuses.Pending, booking);

        return booking;
    }


    async updateBookingStatus(bookingId, status, providerId) {

        const booking = await Booking.findById(bookingId)

        if (!booking) {
            throw ApiError.NotFoundError('Booking not found');
        }

        if (booking.provider._id.toString() !== providerId.toString()) {
            throw ApiError.AccessDeniedError();
        }

        booking.status = status;
        await booking.save();

        this.sendEmailNotification(status, booking);

        return booking;
    }

}

module.exports = new BookingService();