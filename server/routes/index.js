const express = require("express");
const router = express.Router();
const authJwt = require("../middlewares/authJWT");
const authController = require("../controller/auth");
const refresh = require("../controller/refresh");
const budgetController = require("../controller/budget.js");
const categoryController = require("../controller/category");

// 회원가입
router.post("/signup", authController.postSignup);

// 로그인
router.post("/signin", authController.postSignin);

// 카테고리 목록 반환
router.get("/getcategory", categoryController.getCategory);

// 예산 설정
router.post("/budget", budgetController.postSetBudget);

// 예산 수정
router.patch("/budget", budgetController.patchBudget);

// 예산 삭제
router.delete("/budget", budgetController.deleteBudget);

// 예산 확인
router.get("/budget", budgetController.getBudget);

// Test용 getUser
router.get("/getuser", authJwt, authController.getUser);

router.get("./refresh", refresh);
module.exports = router;
