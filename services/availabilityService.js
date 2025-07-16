const Booking = require('../models/Booking');
const User = require('../models/User');
const BookingStatuses = require("../consts/bookingStatuses");

class AvailabilityService {

    async isAvailable(providerId, startTime, endTime) {
        const filter = {
            provider: providerId,
            status: { $ne: BookingStatuses.Canceled },
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
            ]
        };

        const conflictingBookings = await Booking.find(filter);
        return conflictingBookings.length === 0;
    }

}

module.exports = new AvailabilityService();
