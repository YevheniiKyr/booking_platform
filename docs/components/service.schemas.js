module.exports = {
    ServiceCreate: {
        type: 'object',
        properties: {
            name: { type: 'string' , minLength: 1 },
            description: { type: 'string', minLength: 1 },
            duration: { type: 'number', minimum: 1 },
            price: { type: 'number', minimum: 1 },
        },
        required: ['name', 'description', 'duration', "price"],
    },

    ServiceResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            service: {
                type: 'object',
                properties: {
                    _id: { type: 'string', format: 'uuid' },
                    name: { type: 'string', minLength: 1 },
                    description: { type: 'string', minLength: 1 },
                    duration: { type: 'number', minimum: 1 },
                    price: { type: 'number', minimum: 1 },
                    provider: { type: 'string', format: 'uuid' },
                },
            },
        },
    },
};
