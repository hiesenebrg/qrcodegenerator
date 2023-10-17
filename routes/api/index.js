const express = require("express");
const router = express.Router();
const qrcontroller = require("../../controllers");
router.post("/generateqr", qrcontroller.qrgenerator);

module.exports = router;
