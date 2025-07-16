const availabilityService = require('../services/availabilityService');

class AvailabilityController {
    async getProviderAvailability(req, res, next) {
        try {
            const { providerId, date } = req.query;
            const availability = await availabilityService.getProviderAvailability(providerId, date);

            res.json({
                success: true,
                ...availability
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AvailabilityController();