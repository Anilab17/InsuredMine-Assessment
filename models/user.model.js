const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userKey: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String
    },
    dob: {
        type: Date
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    state: {
        type: String
    },
    zip: {
        type: String
    },
    email: {
        type: String
    },
    gender: {
        type: String
    },
    userType: {
        type: String
    },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent"
    }

}, { timestamps: true })

module.exports = mongoose.model('User', userSchema);

