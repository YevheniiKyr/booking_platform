const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');

const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFoundHandler');

const app = express();

app.use(helmet());
app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(morgan('combined'));
app.use(express.json());
app.use(cookieParser())
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/availability', availabilityRoutes)
app.use('*', notFound);
app.use(errorHandler);

module.exports = app;