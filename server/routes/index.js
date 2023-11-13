const express = require("express");
const router = express.Router();
const controller = require("../controller/Cmain");

// add user
router.post("/user", controller.post_user);

module.exports = router;
