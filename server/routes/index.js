const express = require("express");
const router = express.Router();
const authJwt = require("../middlewares/authJWT");
const authController = require("../controller/auth");
const refresh = require("../controller/refresh");
const budgetController = require("../controller/budget");
const categoryController = require("../controller/category");

// 회원가입
router.post("/signup", authController.postSignup);

// 로그인
router.post("/signin", authController.postSignin);

// 카테고리 목록 반환
router.get("/getcategory", categoryController.getCategory);

// 예산 설정
router.post("/setbudget", budgetController.postSetBudget);

// Test용 getUser
router.get("/getuser", authJwt, authController.getUser);

router.get("./refresh", refresh);
module.exports = router;
