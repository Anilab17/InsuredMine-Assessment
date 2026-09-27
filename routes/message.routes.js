const express = require("express");

const {
    scheduleMessage
} = require("../controller/message.controller");

const router = express.Router();

router.post(
    "/schedule",
    scheduleMessage
);

module.exports = router;