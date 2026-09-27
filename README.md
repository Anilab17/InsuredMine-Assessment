# InsuredMine-Assessment

# Setup & installation 
clone, npm install, copy .env.example to .env

# env details
PORT = 5000
MONGO_URI = mongodb://127.0.0.1:27017/file_upload

# Run the application using the below cmd
Running the app — npm run start, npm run dev

# Project overview 
what it does (CSV/XLSX import, policy search/aggregation APIs, CPU watchlog, messages)

# Tech stack 
Node.js, Express, Mongoose/MongoDB, worker_threads, multer, exceljs

# Architecture/data model 
6 collections (Agent, User, UserAccount, PolicyCategory(LOB), PolicyCarrier, Policy)

# Worker Threads (file import)
Node.js executes JavaScript on the main event-loop thread. Processing a large CSV/XLSX file can be CPU-intensive and may block the event loop, affecting other API requests. To avoid this, the upload handler starts a separate Worker Thread for file processing

1. The worker runs independently with its own V8 isolate and memory space, keeping CPU-intensive processing away from the main event loop.
2. The worker creates its own MongoDB connection instead of using the connection created by the main server thread.
3. The worker reads and parses the uploaded CSV/XLSX file and bulk-upserts the processed data into the required MongoDB collections.
4. After processing is completed, the worker sends a success or error message back to the main thread.
5. The application maintains an activeImports counter to track ongoing imports. The CPU watchdog checks this state and avoids restarting the server while an import is in       progress.

Note: This approach keeps CPU-intensive file processing isolated from the main event loop and allows the server to continue handling other API requests during the import.

# CPU Monitoring & Auto-Restart
The application monitors the Node.js process CPU usage and automatically restarts the server when CPU usage remains high for a sustained period

1. Every CPU_SAMPLE_MS (default: 1 second), the application reads process.cpuUsage() and compares the CPU time consumed by the process with the elapsed wall-clock time.        This is used to calculate CPU utilization.
2. To avoid restarting because of a short CPU spike, the application triggers a restart only when CPU usage remains at or above CPU_THRESHOLD (default: 70%) for                CPU_BREACH_SAMPLES (default: 3) consecutive samples.
3. When the threshold is reached, the server performs a graceful shutdown, closes the database connection, and exits with code 1. The watchdog avoids restarting the server     while a file import is currently running, preventing an active import from being interrupted.

Note: If the Node.js process continuously consumes high CPU, the watchdog can restart the application cleanly instead of allowing the process to remain stuck under                sustained CPU load.


# API End-points:
# Upload CSV/XLSX
http://localhost:5000/api/upload
Method: POST
Payload: file : form-data

Uploads and processes insurance data using a Worker Thread.

# Search Policy by Username
http://localhost:5000/api/policies/user/username
**example**: http://localhost:5000/api/policies/user/Lura Lucca
Method: GET

Searches policy information using a username.

# Policy Aggregation:
http://localhost:5000/api/policies/aggregation/users
Method: GET

Provides policy information aggregated by user.

# Schedule Message
http://localhost:5000/api/messages/schedule
Method: POST

Example payload:
{
  "day": "Monday",
  "time": "10:30",
  "message": "New policy scheduled message"
}
