const Service = require('../models/Service');

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
            throw new Error('Service not found');
        }

        return service;
    }

    async updateService(serviceId, serviceData, providerId) {
        const service = await Service.findById(serviceId);

        if (!service) {
            throw new Error('Service not found');
        }

        if (service.provider.toString() !== providerId.toString()) {
            throw new Error('Access denied');
        }

        const updatedService = await Service.findByIdAndUpdate(
            serviceId,
            serviceData,
            { new: true }
        ).populate('provider', 'firstName lastName email');

        return updatedService;
    }

    async deleteService(serviceId, providerId) {
        const service = await Service.findById(serviceId);

        if (!service) {
            throw new Error('Service not found');
        }

        if (service.provider.toString() !== providerId.toString()) {
            throw new Error('Access denied');
        }

        service.isActive = false;
        await service.save();
    }
}

module.exports = new ServiceService();