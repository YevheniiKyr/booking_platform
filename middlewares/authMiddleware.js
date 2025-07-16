const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require("../exceptions/apiError");

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw ApiError.UnauthorizedError();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            throw ApiError.UnauthorizedError();
        }

        req.user = user;
        next();
    } catch (error) {
        next(error)
    }
};


const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
          throw ApiError.AccessDeniedError();
        }
        next();
    };
};

module.exports = { auth, checkRole };