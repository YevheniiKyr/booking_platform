const Service = require('../models/Service');
const ApiError = require('../exceptions/apiError');

class ServiceService {
    async createService(serviceData, providerId) {
        const { name, description, duration, price } = serviceData;

        const service = new Service({
            name,
            description,
            duration,
            price,
            provider: providerId
        });

        await service.save();
        return service;
    }

    async getAllServices(providerId = null) {
        const filter = { isActive: true };

        if (providerId) {
            filter.provider = providerId;
        }

        const services = await Service.find(filter)
            .populate('provider', 'firstName lastName email')
            .sort({ createdAt: -1 });

        return services;
    }

    async getServiceById(serviceId) {
        const service = await Service.findById(serviceId)
            .populate('provider', 'firstName lastName email');

        if (!service) {
            throw ApiError.NotFoundError('Service not found');
        }

        return service;
    }

}

module.exports = new ServiceService();