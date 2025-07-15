const Joi = require('joi');

const serviceSchema = Joi.object({
    description: Joi.string().min(1).required(),
    duration: Joi.number().integer().min(1).required(),
    price: Joi.number().integer().min(1).required(),
})

const updateBookingSchema = Joi.object({
    status: Joi.string().valid([BookingStatuses.Confirmed, BookingStatuses.Canceled]).required()
})
module.exports = {
    serviceSchema,
    updateBookingSchema
}


