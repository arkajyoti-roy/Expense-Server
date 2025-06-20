const MonthlyBudget = require("../models/budget");



const createMonthlyBudget = async (req, res) => {
  try {
    const { openingBalance } = req.body;
    const userId = req.user.userId;

    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    // Prevent duplicate budget for the same month
    const exists = await MonthlyBudget.findOne({ userId, month });
    if (exists) {
      return res.status(409).json({ message: "Budget already set for this month" });
    }

    const budget = await MonthlyBudget.create({ userId, month, openingBalance });

    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({ message: "Failed to set budget", error: err.message });
  }
};

const getMonthlyBudget = async (req, res) => {
  try {
    const userId = req.user.userId;
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const budget = await MonthlyBudget.findOne({ userId, month });

    if (!budget) {
      return res.status(404).json({ message: "No budget set for this month" });
    }

    res.status(200).json(budget);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch budget", error: err.message });
  }
};



const updateMonthlyBudget = async (req, res) => {
  try {
    const { openingBalance } = req.body;
    const userId = req.user.userId;

    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const updated = await MonthlyBudget.findOneAndUpdate(
      { userId, month },
      { openingBalance },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "No budget found to update for this month" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update budget", error: err.message });
  }
};


module.exports = {
  createMonthlyBudget,
  getMonthlyBudget,
  updateMonthlyBudget
};

