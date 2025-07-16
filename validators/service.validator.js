const Joi = require('joi');
const {Confirmed, Canceled} = require("../consts/bookingStatuses");

const serviceSchema = Joi.object({
    name: Joi.string().min(1).required(),
    description: Joi.string().min(1).required(),
    duration: Joi.number().integer().min(1).required(),
    price: Joi.number().integer().min(1).required(),
})

const updateBookingSchema = Joi.object({
    status: Joi.string().valid(Confirmed, Canceled).required()
})
module.exports = {
    serviceSchema,
    updateBookingSchema
}


