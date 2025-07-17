const Roles = require("../../consts/roles");
module.exports = {
    BookingCreate: {
        type: 'object',
        properties: {
            serviceId: { type: 'string' },
            startTime: { type: 'string', format: 'date-time' },
        },
        required: ['serviceId', 'startTime'],
    },

    BookingStatusUpdate: {
        type: 'object',
        properties: {
            status: {
                type: 'string',
                enum: Object.values(Roles)
            },
        },
        required: ['status'],
    },

    BookingResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            booking: {
                type: 'object',
                properties: {
                    _id: { type: 'string', format: "uuid" },
                    serviceId: { type: 'string' },
                    providerId: { type: 'string' },
                    clientId: { type: 'string' },
                    startTime: { type: 'string', format: 'date-time' },
                    endTime: { type: 'string', format: 'date-time' },
                    status: { type: 'string' },
                },
            },
        },
    },
};
