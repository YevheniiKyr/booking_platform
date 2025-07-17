const Joi = require('joi');
const Roles = require('../consts/roles');

const registerSchema = Joi.object({
    firstName: Joi.string().min(2).max(30).required(),
    lastName: Joi.string().min(2).max(30).required(),
    role: Joi.string().valid(...Object.values(Roles)),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
})


module.exports = {
    registerSchema,
    loginSchema,
};
