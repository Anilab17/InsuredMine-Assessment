const os = require("os");

function getCPUUsage() {

    const cpus = os.cpus();

    let idle = 0;
    let total = 0;

    cpus.forEach(cpu => {

        idle += cpu.times.idle;

        total +=
            cpu.times.user +
            cpu.times.nice +
            cpu.times.sys +
            cpu.times.idle +
            cpu.times.irq;
    });

    const idlePercentage = (idle / total) * 100;

    return 100 - idlePercentage;
}

const startCPUMonitor = () => {

    setInterval(() => {

        const usage = getCPUUsage();

        console.log(
            `CPU Usage: ${usage.toFixed(2)}%`
        );

        if (usage >= 70) {
            console.log(
                "CPU usage exceeded 70%. Restarting server..."
            );
            process.exit(1);
        }
    }, 5000);
};

module.exports = {
    startCPUMonitor
};