const express = require("express");

const {
    createScheduledMessage
} = require("../controller/message.controller");

const router = express.Router();
router.post(
    "/schedule",
    createScheduledMessage
);

module.exports = router;