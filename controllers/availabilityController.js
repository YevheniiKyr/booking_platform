const availabilityService = require('../services/availabilityService');

class AvailabilityController {
    async getProviderAvailability(req, res) {
        try {
            const { providerId, date } = req.query;

            if (!providerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Provider ID is required'
                });
            }

            const availability = await availabilityService.getProviderAvailability(providerId, date);

            res.json({
                success: true,
                ...availability
            });
        } catch (error) {
            const status = error.message === 'Provider not found' ? 404 : 500;

            res.status(status).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new AvailabilityController();