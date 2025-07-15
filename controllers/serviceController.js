const {validationResult} = require('express-validator');
const serviceService = require('../services/serviceService');

class ServiceController {
    async create(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const service = await serviceService.createService(req.body, req.user._id);

            res.status(201).json({
                success: true,
                message: 'Service created successfully',
                service
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getAll(req, res) {
        try {
            const {providerId} = req.query;
            const services = await serviceService.getAllServices(providerId);

            res.json({
                success: true,
                services
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            const service = await serviceService.getServiceById(req.params.id);

            res.json({
                success: true,
                service
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new ServiceController();