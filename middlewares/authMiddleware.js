const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../exceptions/apiError');

const auth = async (req, res, next) => {
    try {
        let decoded;
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw ApiError.UnauthorizedError();
        }

        try{
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw ApiError.UnauthorizedError();
        }
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