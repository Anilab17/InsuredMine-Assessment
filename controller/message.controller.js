const {
    scheduleMessage
} = require("../services/message.service");

const createScheduledMessage = async (req, res) => {
console.log("Received request to schedule message:", req.body);
    try {

        const {
            message,
            day,
            time
        } = req.body;

        if (!message || !day || !time) {

            return res.status(400).json({
                success: false,
                message: "message, day and time are required"
            });
        }

        const result = await scheduleMessage(
            message,
            day,
            time
        );
        console.log(
            `Scheduled message1111: "${message}" for ${day} at ${time}`
        );
        return res.status(201).json({
            success: true,
            message: "Message scheduled successfully",
            data: result
        });

    } catch (error) {

        console.error(
            "Schedule message error:",
            error.message
        );

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createScheduledMessage
};