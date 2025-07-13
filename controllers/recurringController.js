const RecurringTransaction = require("../models/RecurringTransaction");

// 💡 Shared weekday validator
const isValidWeekday = (day) =>
  ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].includes(day);

// ➕ Create Monthly Rule
const createMonthlyTransaction = async (req, res) => {
  try {
    const { title, amount, type, startsOn } = req.body;
    const userId = req.user.userId;

    if (!title || !amount || amount <= 0 || !["debit", "credit"].includes(type)) {
      return res.status(400).json({ message: "Invalid monthly rule data." });
    }

    if (!startsOn || isNaN(new Date(startsOn))) {
      return res.status(400).json({ message: "startsOn must be a valid date." });
    }

    const rule = new RecurringTransaction({
      userId,
      title,
      amount,
      type,
      frequency: "monthly",
      startsOn: new Date(startsOn)
    });

    await rule.save();
    res.status(201).json({ message: "Monthly recurring rule created", rule });
  } catch (err) {
    res.status(500).json({ message: "Monthly creation failed", error: err.message });
  }
};

// ➕ Create Weekly Rule
const createWeeklyTransaction = async (req, res) => {
  try {
    const { title, amount, type, startsOn, weeklyDay } = req.body;
    const userId = req.user.userId;

    if (!title || !amount || amount <= 0 || !["debit", "credit"].includes(type)) {
      return res.status(400).json({ message: "Invalid weekly rule data." });
    }

    if (!startsOn || isNaN(new Date(startsOn))) {
      return res.status(400).json({ message: "startsOn must be a valid date." });
    }

    if (!weeklyDay || !isValidWeekday(weeklyDay)) {
      return res.status(400).json({ message: "weeklyDay must be a valid weekday name." });
    }

    const rule = new RecurringTransaction({
      userId,
      title,
      amount,
      type,
      frequency: "weekly",
      startsOn: new Date(startsOn),
      weeklyDay
    });

    await rule.save();
    res.status(201).json({ message: "Weekly recurring rule created", rule });
  } catch (err) {
    res.status(500).json({ message: "Weekly creation failed", error: err.message });
  }
};

// 🧭 Unified Entry Point (optional if you're calling POST /api/recurring)
const createRecurringTransaction = async (req, res) => {
  const { frequency } = req.body;
  if (frequency === "monthly") {
    return await createMonthlyTransaction(req, res);
  } else if (frequency === "weekly") {
    return await createWeeklyTransaction(req, res);
  } else {
    return res.status(400).json({ message: "Unsupported frequency type." });
  }
};

// 📥 Get all rules
const getAllRecurringTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const rules = await RecurringTransaction.find({ userId });
    res.status(200).json({ recurring: rules });
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};

// ✏️ Update rule
const updateRecurringTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const updates = req.body;

    if (updates.startsOn && isNaN(new Date(updates.startsOn))) {
      return res.status(400).json({ message: "Invalid startsOn date." });
    }

    if (updates.weeklyDay && !isValidWeekday(updates.weeklyDay)) {
      return res.status(400).json({ message: "Invalid weekday name." });
    }

    const updated = await RecurringTransaction.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Rule not found." });

    res.status(200).json({ message: "Rule updated", updated });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// 🗑 Delete rule
const deleteRecurringTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const deleted = await RecurringTransaction.findOneAndDelete({ _id: id, userId });

    if (!deleted) return res.status(404).json({ message: "Rule not found." });

    res.status(200).json({ message: "Rule deleted", deleted });
  } catch (err) {
    res.status(500).json({ message: "Deletion failed", error: err.message });
  }
};

module.exports = {
  createRecurringTransaction, // handles both types
  createMonthlyTransaction,   // optional: expose separately
  createWeeklyTransaction,    // optional: expose separately
  getAllRecurringTransactions,
  updateRecurringTransaction,
  deleteRecurringTransaction
};
