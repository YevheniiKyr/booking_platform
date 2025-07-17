module.exports = {
    ErrorResponse: {
        type: 'object',
        properties: {
            message: {type: 'string'},
            errors: {type: 'array', items: {type: 'string'}},
        },
        required: ['message'],
    },
}