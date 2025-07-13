const mongoose = require("mongoose");

const recurringTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["debit", "credit"], default: "debit" },
  frequency: { type: String, enum: ["weekly", "monthly"], required: true },

  startsOn: { type: Date, required: true }, // Now used for weekly and monthly
  weeklyDay: {
    type: String,
    enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  },

  lastGenerated: Date
});

module.exports = mongoose.model("RecurringTransaction", recurringTransactionSchema);
