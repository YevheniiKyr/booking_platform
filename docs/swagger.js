const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const authSchemas = require('./components/auth.schemas');
const availabilitySchemas = require('./components/availability.schemas');
const bookingSchemas = require('./components/booking.schemas');
const registerSchemas = require("./components/auth.schemas");
const errorSchemas = require('./components/error.schemas');
const serviceSchemas = require('./components/service.schemas');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API документація',
            version: '1.0.0',
        },
        components: {
            schemas: {
                Register: authSchemas.RegisterSchema,
                Login: authSchemas.LoginSchema,
                AvailabilityQueryParams: availabilitySchemas.AvailabilityQueryParams,
                AvailabilityResponse: availabilitySchemas.AvailabilityResponse,
                BookingCreate: bookingSchemas.BookingCreate,
                BookingResponse: bookingSchemas.BookingResponse,
                BookingStatusUpdate: bookingSchemas.BookingStatusUpdate,
                LogResponse: registerSchemas.LogResponseSchema,
                RefreshResponse: registerSchemas.RefreshResponseSchema,
                LogoutResponse: registerSchemas.LogoutResponseSchema,
                ErrorResponse: errorSchemas.ErrorResponse,
                ServiceCreate: serviceSchemas.ServiceCreate,
                ServiceResponse: serviceSchemas.ServiceResponse,
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;