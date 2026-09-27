require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const { startCPUMonitor } = require("./services/cpuMonitor.service");

const startServer = async () => {

    await connectDB();
    startCPUMonitor();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();