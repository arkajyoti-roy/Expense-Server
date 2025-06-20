const mongoose = require("mongoose");

const monthlyBudgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  month: {
    type: String, // Format: "2025-06"
    required: true
  },
  openingBalance: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

monthlyBudgetSchema.index({ userId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("MonthlyBudget", monthlyBudgetSchema);
