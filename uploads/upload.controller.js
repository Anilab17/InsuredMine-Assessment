const path = require("path");
const { Worker } = require("worker_threads");

const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload CSV or XLSX file"
            });
        }

        const filePath = path.resolve(req.file.path);

        const extension = path
            .extname(req.file.originalname)
            .toLowerCase();

        // Project root/workers/import.worker.js
        const workerPath = path.join(
            process.cwd(),
            "workers",
            "import.worker.js"
        );

        console.log("================================");
        console.log("Uploaded file:", filePath);
        console.log("Worker path:", workerPath);
        console.log("Worker exists:", require("fs").existsSync(workerPath));
        console.log("================================");

        const worker = new Worker(workerPath, {
            workerData: {
                filePath,
                extension
            }
        });

        worker.on("message", (result) => {
            console.log("Worker result:", result);
        });

        worker.on("error", (error) => {
            console.error("Worker error:", error);
        });

        worker.on("exit", (code) => {
            console.log(`Worker stopped with exit code ${code}`);
        });

        return res.status(202).json({
            success: true,
            message: "File uploaded. Import started in worker thread."
        });

    } catch (error) {
        console.error("Upload error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    uploadFile
};