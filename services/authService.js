const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../exceptions/apiError');

class AuthService {

    daysToMs(daysCount) {
        return daysCount * 24 * 60 * 60 * 1000;
    }


    userToDTO(user) {
        return {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        }
    }


    userDTOToUser(userDTO) {
        const {email, password, firstName, lastName, role} = userDTO;
        const user = new User({
            email,
            password,
            firstName,
            lastName,
            role
        });
        return user;
    }


    setCookies(res, refreshToken) {
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: false,
            maxAge: this.daysToMs(process.env.JWT_REFRESH_EXPIRE_DAYS),
        });
    }


    generateTokens(userId) {
        const accessToken = jwt.sign(
            {userId},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRE}
        );

        const refreshToken = jwt.sign(
            {userId},
            process.env.JWT_REFRESH_SECRET,
            {expiresIn: process.env.JWT_EXPIRE}
        );

        return {accessToken, refreshToken};
    }


    async registerUser(userData) {
        const {email, password, firstName, lastName, role} = userData;

        const existingUser = await User.findOne({email});
        if (existingUser) {
            throw ApiError.BadRequestError('User already exists');
        }

        const user = this.userDTOToUser(userData);

        const {accessToken, refreshToken} = this.generateTokens(user._id);
        user.refreshToken = refreshToken;

        await user.save();

        console.log(`📧 Email notification: Welcome ${firstName} ${lastName}!`);

        return {
            user: this.userToDTO(user),
            accessToken,
            refreshToken
        };
    }


    async loginUser(email, password) {
        const user = await User.findOne({email});
        if (!user) {
            throw ApiError.BadRequestError('Invalid credentials');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw ApiError.BadRequestError('Invalid credentials');
        }

        const {accessToken, refreshToken} = this.generateTokens(user._id);
        user.refreshToken = refreshToken;
        await user.save();

        return {
            user: this.userToDTO(user),
            accessToken,
            refreshToken
        };
    }


    async refreshToken(refreshToken) {
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (error) {
            throw ApiError.UnauthorizedError();
        }
        const user = await User.findById(decoded.userId);

        if (!user || user.refreshToken !== refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const {accessToken, refreshToken: newRefreshToken} = this.generateTokens(user._id);
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
            throw ApiError.UnauthorizedError();
        }

        user.refreshToken = null;
        await user.save();
    }

}

module.exports = new AuthService();
