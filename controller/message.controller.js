const ScheduledMessage = require("../models/ScheduledMessage.model");

const scheduleMessage = async (req, res) => {

    try {

        const {
            message,
            day,
            time
        } = req.body;

        if (!message || !day || !time) {

            return res.status(400).json({
                success: false,
                message:
                    "message, day and time are required"
            });
        }

        const scheduledAt =
            new Date(`${day}T${time}:00`);

        if (isNaN(scheduledAt.getTime())) {

            return res.status(400).json({
                success: false,
                message: "Invalid date/time"
            });
        }

        if (scheduledAt <= new Date()) {

            return res.status(400).json({
                success: false,
                message: "Scheduled date and time must be in the future"
            });

        }

        const scheduledMessage =
            await ScheduledMessage.create({
                message,
                scheduledAt,
                status
            });

        return res.status(201).json({
            success: true,
            message:
                "Message scheduled successfully",
            data: scheduledMessage
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    scheduleMessage
};