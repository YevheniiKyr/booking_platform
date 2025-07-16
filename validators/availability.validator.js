const Joi = require('joi');

const availabilitySchema = Joi.object({
    data: Joi.date().required(),
});


module.exports = {
    availabilitySchema
};
