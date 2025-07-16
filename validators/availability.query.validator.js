const Joi = require('joi');

const availabilityQueryParamsSchema = Joi.object({
    providerId: Joi.string().length(24).hex().required(),
    date: Joi.date().iso()
});


module.exports = {
    availabilityQueryParamsSchema
};
