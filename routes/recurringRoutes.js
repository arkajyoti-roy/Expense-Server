const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createRecurringTransaction,
  getAllRecurringTransactions,
  updateRecurringTransaction,
  deleteRecurringTransaction
} = require("../controllers/recurringController");

router.post("/", auth, createRecurringTransaction); // Add SIP/EMI rule
router.get("/", auth, getAllRecurringTransactions);

router.put("/:id", auth, updateRecurringTransaction);
router.delete("/:id", auth, deleteRecurringTransaction);


module.exports = router;
