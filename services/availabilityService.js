const Booking = require('../models/Booking');
const User = require('../models/User');
const BookingStatuses = require("../consts/bookingStatuses");
const Roles = require("../consts/roles");
const ApiError = require("../exceptions/ApiError");
const WorkingHours = require("../consts/WorkingHours");

class AvailabilityService {

    async isAvailable(providerId, startTime, endTime) {
        const startWorkTime = new Date(startTime);
        startWorkTime.setHours(WorkingHours.Start);
        startWorkTime.setMinutes(0);
        startWorkTime.setSeconds(0);

        const endWorkTime = new Date(endTime);
        endWorkTime.setHours(WorkingHours.End);
        endWorkTime.setMinutes(0);
        endWorkTime.setSeconds(0);

        if(endTime > endWorkTime || startTime < startWorkTime) return false;
        const filter = {
            provider: providerId,
            status: { $ne: BookingStatuses.Canceled },
            startTime: { $lt: endTime },
            endTime: { $gt: startTime }
        };

        const conflictingBookings = await Booking.find(filter);
        return conflictingBookings.length === 0;
    }


    async getProviderAvailability(providerId, date) {
        const provider = await User.findById(providerId);
        if (!provider || provider.role !== Roles.Provider) {
            throw ApiError.NotFoundError('Provider not found');
        }

        const targetDate = date ? new Date(date) : new Date();
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        const bookings = await Booking.find({
            provider: providerId,
            status: { $ne: BookingStatuses.Canceled },
            startTime: { $gte: startOfDay },
            endTime: { $lte: endOfDay }
        }).sort({ startTime: 1 });


        const timeSlots = [];
        for (let hour = WorkingHours.Start; hour < WorkingHours.End; hour++) {
                const slotTime = new Date(targetDate);
                slotTime.setHours(hour, 0, 0, 0);

                const slotEndTime = new Date(slotTime);
                slotEndTime.setHours(slotEndTime.getHours()+1);

                const isAvailable = !bookings.some(booking =>
                    (slotTime >= booking.startTime && slotTime < booking.endTime) ||
                    (slotEndTime > booking.startTime && slotEndTime <= booking.endTime) ||
                    (slotTime <= booking.startTime && slotEndTime >= booking.endTime)
                );
                if(isAvailable){
                    timeSlots.push({
                        startTime: slotTime,
                        endTime: slotEndTime
                    });
                }
        }

        return {
            freeSlots: timeSlots,
        };
    }

}

module.exports = new AvailabilityService();
