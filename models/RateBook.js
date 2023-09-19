const mongoose = require('mongoose');

const rateBookSchema = mongoose.Schema({
    userId: {type: String, required: true },
    rating: {type: Number, required: true }
});

module.exports = mongoose.model('RateBook', rateBookSchema);