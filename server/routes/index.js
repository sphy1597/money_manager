const express = require("express");
const router = express.Router();
const authJwt = require("../middlewares/authJWT");
const authcontroller = require("../controller/auth");
const refresh = require("../controller/refresh");

// 회원가입
router.post("/signup", authcontroller.postSignup);

// 로그인
router.post("/signin", authcontroller.postSignin);

// Test용 getUser
router.get("/getuser", authJwt, authcontroller.getUser);

router.get("./refresh", refresh);
module.exports = router;
