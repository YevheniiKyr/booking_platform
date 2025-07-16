const Joi = require('joi');

const availabilitySchema = Joi.object({
    providerId: Joi.string().length(24).hex().required(),
    data: Joi.date().required(),
});


module.exports = {
    availabilitySchema
};
