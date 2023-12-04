const express = require("express");
const router = express.Router();
const authJwt = require("../middlewares/authJWT");
const authController = require("../controller/auth");
const refresh = require("../controller/refresh");
const budgetController = require("../controller/budget.js");
const categoryController = require("../controller/category");
const spendingController = require("../controller/spending");
const statsController = require("../controller/stats");
// 회원가입
router.post("/signup", authController.postSignup);

// 로그인
router.post("/signin", authController.postSignin);

// 카테고리 목록 반환
router.get("/getcategory", categoryController.getCategory);

/* ------------- 예산 ------------ */
router.post("/budget", authJwt, budgetController.postSetBudget);
router.patch("/budget", authJwt, budgetController.patchBudget);
router.delete("/budget", authJwt, budgetController.deleteBudget);
router.get("/budget", authJwt, budgetController.getBudget);

/* ------------- 지출 ------------ */
router.get("/spending", authJwt, spendingController.getSpending);
router.post("/spending", authJwt, spendingController.postSetSpending);
router.patch("/spending", authJwt, spendingController.patchSpending);
router.delete("/spending", authJwt, spendingController.deleteSpending);

/* ------------- 통계 ------------- */
router.get("/goodnight", authJwt, statsController.goodNight);
router.get("/goodmorning", authJwt, statsController.goodMorning);

// Test용 getUser
router.get("/getuser", authJwt, authController.getUser);

router.get("./refresh", refresh);
module.exports = router;
