const express = require("express");
const {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getLastSixMonthsTransactions,
  getCustomTransactionsWithSummary
} = require("../controllers/transactionController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, addTransaction);
router.get("/", auth, getTransactions);
router.get("/custom", auth, getCustomTransactionsWithSummary);
router.get("/last-six-months", auth, getLastSixMonthsTransactions); // Get last 6 months transactions

router.put("/:id", auth, updateTransaction);      // Update by ID
router.delete("/:id", auth, deleteTransaction);   // Delete by ID

module.exports = router;
