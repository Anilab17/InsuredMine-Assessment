const { parentPort, workerData } = require("worker_threads");
const mongoose = require("mongoose");
const fs = require("fs");
const csv = require("csv-parser");
const XLSX = require("xlsx");

const Agent = require("../models/agent.model");
const User = require("../models/user.model");
const Account = require("../models/userAccount.model");
const LOB = require("../models/lob.model");
const Carrier = require("../models/policyCarrier.model");
const Policy = require("../models/policy.model");

async function connectDB() {
    await mongoose.connect(process.env.MONGO_URI);
}

function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const rows = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", row => rows.push(row))
            .on("end", () => resolve(rows))
            .on("error", reject);
    });
}

function parseXLSX(filePath) {
    const workbook = XLSX.readFile(filePath);

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    return XLSX.utils.sheet_to_json(worksheet);
}

async function importData() {
    try {
        await connectDB();

        let rows;

        if (workerData.extension === ".csv") {
            rows = await parseCSV(workerData.filePath);
        } else {
            rows = parseXLSX(workerData.filePath);
        }

        console.log(`Processing ${rows.length} records`);

        for (const row of rows) {

            // Agent
            let agent = await Agent.findOne({
                name: row.agent
            });

            if (!agent) {
                agent = await Agent.create({
                    name: row.agent
                });
            }

            let user = await User.findOne({
                firstname: row.firstname,
                email: row.email
            });

            if (!user) {
                user = await User.create({
                    firstname: row.firstname,
                    dob: row.dob || null,
                    address: row.address,
                    phone: row.phone,
                    state: row.state,
                    zip: row.zip,
                    email: row.email,
                    gender: row.gender,
                    userType: row.userType,
                    agentId: agent._id
                });
            }

            let account = await Account.findOne({
                accountName: row.account_name
            });

            if (!account) {
                account = await Account.create({
                    accountName: row.account_name
                });
            }

            let lob = await LOB.findOne({
                category_name: row.category_name
            });

            if (!lob) {
                lob = await LOB.create({
                    category_name: row.category_name
                });
            }

            let carrier = await Carrier.findOne({
                companyName: row.company_name
            });

            if (!carrier) {
                carrier = await Carrier.create({
                    companyName: row.company_name
                });
            }

            const existingPolicy = await Policy.findOne({
                policyNumber: row.policy_number
            });

            if (!existingPolicy) {
                await Policy.create({
                    policyNumber: row.policy_number,

                    policyStartDate: row.policy_start_date,

                    policyEndDate: row.policy_end_date,

                    userId: user._id,

                    accountId: account._id,

                    lobId: lob._id,

                    carrierId: carrier._id
                });
            }
        }

        parentPort.postMessage({
            success: true,
            message: `Successfully imported ${rows.length} records`
        });

    } catch (error) {

        parentPort.postMessage({
            success: false,
            error: error.message
        });

    } finally {
        await mongoose.connection.close();
    }
}

importData();