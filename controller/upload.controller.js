const path = require("path");
const { Worker } = require("worker_threads");
console.log("workers thread path")

const uploadFile = async (req, res) => {
   console.log("upload file path", req.file.path);
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Please upload CSV or XLSX file"
        });
    }

    const filePath = req.file.path;

    const extension = path.extname(req.file.originalname)
        .toLowerCase();

    const worker = new Worker(
        path.join(
            __dirname,
            "..",
            "workers",
            "import.worker.js"
        ),
        {
            workerData: {
                filePath,
                extension
            }
        }
    );

    worker.on("message", result => {
        console.log("Worker result:", result);
    });

    worker.on("error", error => {
        console.error("Worker error:", error);
    });

    worker.on("exit", code => {
        console.log(
            `Worker stopped with exit code ${code}`
        );
    });

    return res.status(202).json({
        success: true,
        message: "File uploaded. Import started in worker thread."
    });
};

module.exports = {
    uploadFile
};