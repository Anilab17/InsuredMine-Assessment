const mongoose = require("mongoose");

const scheduledMessageSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: true
        },

        scheduledAt: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: [
                "pending",
                "processed"
            ],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('ScheduledMessage', scheduledMessageSchema);