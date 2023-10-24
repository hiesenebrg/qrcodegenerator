const express = require("express");
const router = express.Router();
const qrcontroller = require("../../controllers");
router.post("/generateqr", qrcontroller.qrgenerator);
// router.post("/generateqr", function(req, res){
//     return qrcontroller.qrgenerator
//   });
module.exports = router;
