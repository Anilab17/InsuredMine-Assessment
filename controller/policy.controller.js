const User = require("../models/user.model");
const Policy = require("../models/policy.model");

require("../models/userAccount.model");
require("../models/policyCategory.model");
require("../models/policyCarrier.model");
require("../models/agent.model");
require("../models/lob.model");

const getPoliciesByUser = async (req, res) => {
    try {

        const { username } = req.params;

        const user = await User.findOne({
            firstName: {
                $regex: username,
                $options: "i"
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const policies = await Policy.find({
            userId: user._id
        })
            .populate("userId")
            .populate("accountId")
            .populate("lobId")
            .populate("carrierId");

        return res.json({
            success: true,
            user,
            policies
        });

    } catch (error) {
       console.log("Error in getPoliciesByUser:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getPolicyAggregation = async (req, res) => {
    try {

        const result = await Policy.aggregate([
            {
                $group: {
                    _id: "$userId",
                    totalPolicies: {
                        $sum: 1
                    }
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },

            {
                $unwind: "$user"
            },

            {
                $project: {
                    _id: 0,

                    userId: "$user._id",

                    username: "$user.firstName",

                    email: "$user.email",

                    totalPolicies: 1
                }
            },

            {
                $sort: {
                    totalPolicies: -1
                }
            }
        ]);

        res.json({
            success: true,
            data: result
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getPoliciesByUser,
    getPolicyAggregation
};