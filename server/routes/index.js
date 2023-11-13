const express = require("express");
const router = express.Router();
const authJwt = require("../middlewares/authJWT");
const authcontroller = require("../controller/auth");
const refresh = require("../controller/refresh");

// add user
router.post("/signup", authcontroller.post_signup);
router.post("/signin", authcontroller.post_signin);

router.get("./refresh", refresh);
module.exports = router;
