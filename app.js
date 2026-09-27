const express = require("express");
const cors = require("cors");

const uploadRoutes = require("./routes/upload.routes");
const policyRoutes = require("./routes/policy.routes");
const messageRoutes = require("./routes/message.routes");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is running"
    });
});

app.use(
    "/api/upload",
    uploadRoutes
);

app.use(
    "/api/policies",
    policyRoutes
);

app.use(
    "/api/messages",
    messageRoutes
);

module.exports = app;