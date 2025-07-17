const Roles = require("../../consts/roles");

module.exports = {
    RegisterSchema: {
        type: 'object',
        properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            firstName: { type: 'string', format: 'string', minLength: 2, maxLength: 30 },
            lastName: { type: 'string', format: 'string', minLength: 2, maxLength: 30 },
            role: { type: 'string', enum: Object.values(Roles)},
        },
        required: ['email', 'password', 'firstName', 'lastName'],
    },

    LogResponseSchema: {
        type: 'object',
        properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            user: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    email: { type: 'string', format: 'email' },
                    firstName: { type: 'string', minLength: 2},
                    lastName: { type: 'string', minLength: 2},
                    role: { type: 'string', enum: Object.values(Roles)},
                }
            },
            accessToken: {type: 'string', format: 'string'},
            refreshToken: {type: 'string', format: 'string'},
        },
        required: ['email', 'password', 'firstName', 'lastName'],
    },

    RefreshResponseSchema: {
        type: 'object',
        properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            accessToken: { type: 'string', format: 'string' },
        },
        required: ['success', 'message', 'accessToken'],
    },

    LogoutResponseSchema: {
        type: 'object',
        properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
        },
        required: ['success', 'message'],
    },

    LoginSchema: {
        type: 'object',
        properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
        },
        required: ['email', 'password'],
    },
};
