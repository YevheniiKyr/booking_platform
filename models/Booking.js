const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    totalPrice: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

// Index for efficient availability checks
bookingSchema.index({ provider: 1, startTime: 1, endTime: 1 });

module.exports = mongoose.model('Booking', bookingSchema);