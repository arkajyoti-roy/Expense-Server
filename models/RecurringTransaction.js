const mongoose = require("mongoose");

const recurringTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["debit", "credit"], default: "debit" },
  frequency: { type: String, enum: ["weekly", "monthly"], required: true },
  day: Number, // 1–7 (Mon–Sun), or 1–31 for monthly
  startDate: { type: Date, required: true },
  endDate: Date,
  lastGenerated: Date
});

module.exports = mongoose.model("RecurringTransaction", recurringTransactionSchema);
