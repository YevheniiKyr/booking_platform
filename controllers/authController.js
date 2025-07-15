const { validationResult } = require('express-validator');
const authService = require('../services/authService');

class AuthController {
    async register(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const result = await authService.registerUser(req.body);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                ...result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async login(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { email, password } = req.body;
            const result = await authService.loginUser(email, password);

            res.json({
                success: true,
                message: 'Login successful',
                ...result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async refresh(req, res) {
        try {
            const { refreshToken } = req.body;
            const tokens = await authService.refreshToken(refreshToken);

            res.json({
                success: true,
                tokens
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    async logout(req, res) {
        try {
            await authService.logoutUser(req.id);

            res.json({
                success: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new AuthController