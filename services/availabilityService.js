const Booking = require('../models/Booking');
const User = require('../models/User');

class AvailabilityService {
    async getProviderAvailability(providerId, date) {
        const provider = await User.findById(providerId);
        if (!provider || provider.role !== 'Provider') {
            throw new Error('Provider not found');
        }

        // Default to today if no date provided
        const targetDate = date ? new Date(date) : new Date();
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Get all bookings for the provider on the target date
        const bookings = await Booking.find({
            provider: providerId,
            status: { $ne: 'cancelled' },
            startTime: { $gte: startOfDay },
            endTime: { $lte: endOfDay }
        }).sort({ startTime: 1 });

        // Working hours (9 AM to 6 PM)
        const workingHours = {
            start: 9,
            end: 18
        };

        // Generate time slots (30-minute intervals)
        const timeSlots = [];
        for (let hour = workingHours.start; hour < workingHours.end; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const slotTime = new Date(targetDate);
                slotTime.setHours(hour, minute, 0, 0);

                const slotEndTime = new Date(slotTime);
                slotEndTime.setMinutes(slotEndTime.getMinutes() + 30);

                // Check if this slot conflicts with any booking
                const isAvailable = !bookings.some(booking =>
                    (slotTime >= booking.startTime && slotTime < booking.endTime) ||
                    (slotEndTime > booking.startTime && slotEndTime <= booking.endTime) ||
                    (slotTime <= booking.startTime && slotEndTime >= booking.endTime)
                );

                timeSlots.push({
                    time: slotTime.toISOString(),
                    available: isAvailable
                });
            }
        }

        return {
            provider: {
                id: provider._id,
                name: `${provider.firstName} ${provider.lastName}`,
                email: provider.email
            },
            date: targetDate.toISOString().split('T')[0],
            workingHours,
            timeSlots,
            bookings: bookings.map(booking => ({
                id: booking._id,
                startTime: booking.startTime,
                endTime: booking.endTime,
                status: booking.status
            }))
        };
    }
}

module.exports = new AvailabilityService();
