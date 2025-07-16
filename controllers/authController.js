const authService = require('../services/authService');
const {auth} = require("../middlewares/authMiddleware");
const {token} = require("morgan");

class AuthController {

    async register(req, res, next) {
        try {
            const {refreshToken, ...result} = await authService.registerUser(req.body);
            authService.setCookies(res, refreshToken);
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                ...result
            });
        } catch (error) {
            next(error)
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const {refreshToken, ...result} = await authService.loginUser(email, password);
            console.log("setCookies")
            authService.setCookies(res, refreshToken);

            res.json({
                success: true,
                message: 'Login successful',
                ...result
            });
        } catch (error) {
            next(error)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const tokens = await authService.refreshToken(refreshToken);
            authService.setCookies(res, tokens.refreshToken);
            res.json({
                success: true,
                accessToken: tokens.accessToken
            });
        } catch (error) {
            next(error)
        }
    }

    async logout(req, res, next) {
        try {
            await authService.logoutUser(req.user._id);
            res.clearCookie('refreshToken');
            res.json({
                success: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AuthController