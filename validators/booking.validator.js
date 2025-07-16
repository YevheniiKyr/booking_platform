const Joi = require('joi');
const {Confirmed, Canceled} = require("../consts/bookingStatuses");

const bookingSchema = Joi.object({
    serviceId: Joi.string().length(24).hex().required(),
    startTime: Joi.date().iso().min(Date.now()).required(),
})

const updateBookingSchema = Joi.object({
    status: Joi.string().valid(Confirmed, Canceled).required()
})

module.exports = {
    bookingSchema,
    updateBookingSchema
}
