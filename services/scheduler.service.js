const ScheduledMessage =
    require("../models/ScheduledMessage.model");

const Message = require("../models/message.model");

const startScheduler = () => {

    setInterval(async () => {

        try {

            const now = new Date();

            const messages =
                await ScheduledMessage.find({
                    status: "pending",
                    scheduledAt: {
                        $lte: now
                    }
                });

            for (const scheduled of messages) {

                await Message.create({
                    message: scheduled.message
                });

                scheduled.status = "processed";

                await scheduled.save();

                console.log(
                    `Message inserted: ${scheduled.message}`
                );
            }

        } catch (error) {

            console.error(
                "Scheduler error:",
                error.message
            );
        }

    }, 10000);
};

module.exports = {
    startScheduler
};