const mongoose = require('mongoose')

const RatingSchema = new mongoose.Schema({
    accomodationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Accomodation',
        require: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    rating: {
        type: Number,
        require:true
    },
    comment: String,
    createAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('rating', RatingSchema)