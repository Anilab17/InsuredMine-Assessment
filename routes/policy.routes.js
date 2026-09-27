const express = require("express");

const {getPoliciesByUser, getPolicyAggregation} = require("../controller/policy.controller");

const router = express.Router();

router.get("/user/:username",getPoliciesByUser);

router.get("/aggregation/users",getPolicyAggregation);

module.exports = router;
