const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createRecurringTransaction,
  createMonthlyTransaction,
  createWeeklyTransaction,
  getAllRecurringTransactions,
  updateRecurringTransaction,
  deleteRecurringTransaction
} = require("../controllers/recurringController");

// Unified route for both monthly and weekly
router.post("/", auth, createRecurringTransaction);

// Optional: direct access to monthly/weekly creation
router.post("/monthly", auth, createMonthlyTransaction);
router.post("/weekly", auth, createWeeklyTransaction);

router.get("/", auth, getAllRecurringTransactions);
router.put("/:id", auth, updateRecurringTransaction);
router.delete("/:id", auth, deleteRecurringTransaction);


const generateRecurring = require("../utils/generateRecurring");

router.post("/generate", auth, async (req, res) => {
  try {
    await generateRecurring();
    res.status(200).json({ message: "Manual generation complete ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
