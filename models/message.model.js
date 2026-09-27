const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: true
        },

        insertedAt: {
            type: Date,
            default: Date.now
        },
        scheduledAt: {
            type: Date,
            required: true
        },
        scheduledDay: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Message', messageSchema);