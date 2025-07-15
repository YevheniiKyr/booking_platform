const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {verify} = require("jsonwebtoken");

class AuthService {
    generateTokens(userId) {
        const accessToken = jwt.sign(
            { userId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        const refreshToken = jwt.sign(
            { userId },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRE }
        );

        return { accessToken, refreshToken };
    }

    async registerUser(userData) {
        const { email, password, firstName, lastName, role } = userData;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const user = new User({
            email,
            password,
            firstName,
            lastName,
            role
        });

        const { accessToken, refreshToken } = this.generateTokens(user._id);
        user.refreshToken = refreshToken;

        await user.save();

        // Send email notification
        console.log(`📧 Email notification: Welcome ${firstName} ${lastName}!`);

        return {
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            },
            tokens: {
                accessToken,
                refreshToken
            }
        };
    }

    async loginUser(email, password) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const { accessToken, refreshToken } = this.generateTokens(user._id);
        user.refreshToken = refreshToken;
        await user.save();

        return {
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            },
            tokens: {
                accessToken,
                refreshToken
            }
        };
    }

    async refreshToken(refreshToken) {
        if (!refreshToken) {
            throw new Error('Refresh token required');
        }

        const decoded = verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || user.refreshToken !== refreshToken) {
            throw new Error('Invalid refresh token');
        }

        const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(user._id);
        user.refreshToken = newRefreshToken;
        await user.save();

        return {
            accessToken,
            refreshToken: newRefreshToken
        };
    }

    async logoutUser(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.refreshToken = null;
        await user.save();
    }
}

module.exports = new AuthService();
