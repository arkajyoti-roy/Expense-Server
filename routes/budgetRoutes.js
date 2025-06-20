const express = require("express");
const {
  createMonthlyBudget,
  getMonthlyBudget,
  updateMonthlyBudget
} = require("../controllers/budgetController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, createMonthlyBudget);
router.get("/", auth, getMonthlyBudget);
router.put("/", auth, updateMonthlyBudget); // 🆕 Update openingBalance

module.exports = router;
