const Joi = require('joi');

const availabilitySchema = Joi.object({
    providerId: Joi.string().required(),
    data: Joi.date().required(),
});


module.exports = {
    availabilitySchema
};
