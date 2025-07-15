const Joi = require('joi');
const {BookingStatuses} = require("../consts/bookingStatuses");

const bookingSchema = Joi.object({
    serviceId: Joi.string().required(),
    startTime: Joi.date().timestamp().required(),
})

const updateBookingSchema = Joi.object({
    status: Joi.string().valid([BookingStatuses.Confirmed, BookingStatuses.Canceled]).required()
})
module.exports = {
    bookingSchema,
    updateBookingSchema
}