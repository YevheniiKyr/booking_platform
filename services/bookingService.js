const Booking = require('../models/Booking');
const Service = require('../models/Service');

class BookingService {
    async checkAvailability(providerId, startTime, endTime, excludeBookingId = null) {
        const filter = {
            provider: providerId,
            status: { $ne: 'cancelled' },
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
            ]
        };

        if (excludeBookingId) {
            filter._id = { $ne: excludeBookingId };
        }

        const conflictingBookings = await Booking.find(filter);
        return conflictingBookings.length === 0;
    }

    sendEmailNotification(type, booking, user) {
        const messages = {
            created: `📧 Email to ${user.email}: Your booking for ${booking.service.name} has been created and is pending confirmation.`,
            confirmed: `📧 Email to ${user.email}: Your booking for ${booking.service.name} has been confirmed!`,
            cancelled: `📧 Email to ${user.email}: Your booking for ${booking.service.name} has been cancelled.`
        };

        console.log(messages[type]);
    }

    async createBooking(bookingData, clientId) {
        const { serviceId, startTime } = bookingData;

        const service = await Service.findById(serviceId).populate('provider');
        if (!service) {
            throw new Error('Service not found');
        }

        const start = new Date(startTime);
        const end = new Date(start.getTime() + service.duration * 60000);

        // Check if provider is available
        const isAvailable = await this.checkAvailability(service.provider._id, start, end);
        if (!isAvailable) {
            throw new Error('Provider is not available at this time');
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
        await booking.populate(['service', 'client', 'provider']);

        // Send notification to client
        this.sendEmailNotification('created', booking, { email: booking.client.email });

        return booking;
    }

    async getUserBookings(userId, userRole) {
        const filter = {};

        if (userRole === 'Client') {
            filter.client = userId;
        } else if (userRole === 'Provider') {
            filter.provider = userId;
        }

        const bookings = await Booking.find(filter)
            .populate('service', 'name description duration price')
            .populate('client', 'firstName lastName email')
            .populate('provider', 'firstName lastName email')
            .sort({ startTime: -1 });

        return bookings;
    }

    async updateBookingStatus(bookingId, status, providerId) {
        const booking = await Booking.findById(bookingId)
            .populate(['service', 'client', 'provider']);

        if (!booking) {
            throw new Error('Booking not found');
        }

        if (booking.provider._id.toString() !== providerId.toString()) {
            throw new Error('Access denied');
        }

        booking.status = status;
        await booking.save();

        // Send notification to client
        this.sendEmailNotification(status, booking, booking.client);

        return booking;
    }

    async cancelBooking(bookingId, userId, userRole) {
        const booking = await Booking.findById(bookingId)
            .populate(['service', 'client', 'provider']);

        if (!booking) {
            throw new Error('Booking not found');
        }

        // Client can cancel own bookings, Provider can cancel any booking they provide
        if (userRole === 'Client' && booking.client._id.toString() !== userId.toString()) {
            throw new Error('Access denied');
        }

        if (userRole === 'Provider' && booking.provider._id.toString() !== userId.toString()) {
            throw new Error('Access denied');
        }

        booking.status = 'cancelled';
        await booking.save();

        // Send notification to client
        this.sendEmailNotification('cancelled', booking, booking.client);

        return booking;
    }
}

module.exports = new BookingService();