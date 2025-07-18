module.exports = {
    AvailabilityQueryParams: {
        type: 'object',
        properties: {
            providerId: { type: 'string' },
            date: { type: 'string', format: 'date' },
        },
        required: ['providerId', 'date'],
    },

    AvailabilityResponse: {
        type: 'object',
        properties: {
            availableSlots: {
                type: 'array',
                items: { type: 'string', format: 'time' },
                description: 'Array of available time slots',
            },
        },
        example: {
            availableSlots: ['09:00', '10:30', '14:00'],
        },
    },
};
