const serviceService = require('../services/serviceService');

class ServiceController {
    async create(req, res, next) {
        try {
            const service = await serviceService.createService(req.body, req.user._id);

            res.status(201).json({
                success: true,
                message: 'Service created successfully',
                service
            });
        } catch (error) {
            next(error)
        }
    }

    async getAll(req, res, next) {
        try {
            const {providerId} = req.query;
            const services = await serviceService.getAllServices(providerId);

            res.json({
                success: true,
                services
            });
        } catch (error) {
            next(error)
        }
    }

    async getById(req, res, next) {
        try {
            const service = await serviceService.getServiceById(req.params.id);

            res.json({
                success: true,
                service
            });
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new ServiceController();