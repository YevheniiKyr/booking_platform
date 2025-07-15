const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
})

const refreshSchema = Joi.object({
    refreshToken: Joi.string().required(),
})

const logoutSchema = Joi.object({
    id: Joi.string().required(),
})

module.exports = {
    registerSchema,
    loginSchema,
    logoutSchema,
    refreshSchema,
};
