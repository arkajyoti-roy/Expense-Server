const Transaction = require("../models/transaction");
const RecurringTransaction = require("../models/RecurringTransaction");
const Budget = require("../models/budget");
const mongoose = require("mongoose");

// Add a new transaction
const addTransaction = async (req, res) => {
  try {
    const { type, amount, description } = req.body;
    if (!["credit", "debit"].includes(type)) {
      return res.status(400).json({ message: "Type must be credit or debit" });
    }

    const transaction = await Transaction.create({
      userId: req.user.userId,
      type,
      amount,
      description
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Transaction failed", error: err.message });
  }
};

// Get transactions for current month + live budget summary
const getTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Regular transactions for the month
    const transactions = await Transaction.find({
      userId,
      date: { $gte: start, $lt: end }
    }).sort({ date: 1 });

    // Find budget for the month
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const budget = await Budget.findOne({ userId, month: monthKey });
    const openingBalance = budget?.openingBalance || 0;

    // Totals from transactions
    const totalCredit = transactions
      .filter(txn => txn.type === "credit")
      .reduce((sum, txn) => sum + txn.amount, 0);

    const totalDebit = transactions
      .filter(txn => txn.type === "debit")
      .reduce((sum, txn) => sum + txn.amount, 0);

    // Recurring transactions for the user (optional: filter by month)
    const recurring = await RecurringTransaction.find({
      userId,
      startDate: { $lte: now },
      $or: [{ endDate: null }, { endDate: { $gte: start } }]
    });

    const totalRecurring = recurring.reduce((sum, r) => sum + r.amount, 0);

    // Final net balance including recurring deduction
    const netBalance = openingBalance + totalCredit - totalDebit - totalRecurring;

    res.status(200).json({
      transactions,
      openingBalance,
      totalCredit,
      totalDebit,
      totalRecurring,
      netBalance
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch transactions", error: err.message });
  }
};


// Update a transaction
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

// Get last 6 months' transactions + recurring
const getLastSixMonthsTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [transactions, recurring] = await Promise.all([
      Transaction.find({
        userId,
        date: { $gte: sixMonthsAgo, $lte: now }
      }).sort({ date: 1 }),
      RecurringTransaction.find({ userId })
    ]);

    res.status(200).json({ transactions, recurring });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch 6-month history", error: err.message });
  }
};

// Get transactions within a custom date range + summary + recurring
const getCustomTransactionsWithSummary = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ message: "Start and end dates are required" });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setDate(endDate.getDate() + 1); // include final day

    const transactions = await Transaction.find({
      userId,
      date: { $gte: startDate, $lt: endDate }
    }).sort({ date: 1 });

    const [creditTotal, debitTotal, recurring] = await Promise.all([
      Transaction.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            date: { $gte: startDate, $lt: endDate },
            type: "credit"
          }
        },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Transaction.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            date: { $gte: startDate, $lt: endDate },
            type: "debit"
          }
        },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      RecurringTransaction.find({ userId })
    ]);

    res.status(200).json({
      transactions,
      recurring,
      summary: {
        totalCredit: creditTotal[0]?.total || 0,
        totalDebit: debitTotal[0]?.total || 0,
        netBalance: (creditTotal[0]?.total || 0) - (debitTotal[0]?.total || 0)
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch custom transactions", error: err.message });
  }
};

module.exports = {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getLastSixMonthsTransactions,
  getCustomTransactionsWithSummary
};
