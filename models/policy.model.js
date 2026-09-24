const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({

    policyNumber: {
        type: String,
        required: true,
        unique: true
    },

    policyStartDate: Date,

    policyEndDate: Date,

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account"
    },

    lobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LOB"
    },

    carrierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Carrier"
    }
},
    { timestamps: true });

module.exports = mongoose.model('Policy', policySchema);