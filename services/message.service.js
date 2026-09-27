const Message = require("../models/message.model");

const scheduleMessage = async (message, day, time) => {
    console.log(
        `Scheduling message: "${message}" for ${day} at ${time}`
    );

    const scheduledDate = new Date(
        `${day}T${time}:00`
    );

    if (isNaN(scheduledDate.getTime())) {
        throw new Error("Invalid day or time");
    }

    const currentDate = new Date();

    if (scheduledDate <= currentDate) {
        throw new Error(
            "Scheduled day and time must be in the future"
        );
    }

    const savedMessage = await Message.create({
        message,
        scheduledAt: scheduledDate,
        scheduledDay: day
    });

    return {
        ...savedMessage.toObject(),
        day,
        time
    };
};

module.exports = {
    scheduleMessage
};