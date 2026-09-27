const cron = require("node-cron");

const ScheduledMessage =
    require("../models/ScheduledMessage.model");

const Message =
    require("../models/message.model");


const startMessageScheduler = () => {

    console.log(
        "Message scheduler started..."
    );

    cron.schedule("*/5 * * * *", async () => {

        try {

            const now = new Date();

            const scheduledMessages =
                await ScheduledMessage.find({
                    status: "pending",
                    scheduledAt: {
                        $lte: now
                    }
                });

            if (scheduledMessages.length === 0) {
                return;
            }

            console.log(
                `Found ${scheduledMessages.length} scheduled message(s)`
            );

            for (
                const scheduledMessage
                of scheduledMessages
            ) {

                // Insert into Message collection
                await Message.create({

                    message:
                        scheduledMessage.message

                });

                // Update scheduled message
                scheduledMessage.status =
                    "processed";

                scheduledMessage.processedAt =
                    new Date();

                await scheduledMessage.save();

                console.log(
                    "Message processed:",
                    scheduledMessage.message
                );
            }

        } catch (error) {

            console.error(
                "Scheduler error:",
                error
            );

        }

    });
};


module.exports = {
    startMessageScheduler
};