const mongoose = require("mongoose");

const monthEndBalanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  month: {
    type: String, // Format: "2025-07"
    required: true
  },
  openingBalance: {
    type: Number,
    required: true
  },
  leftoverBalance: {
    type: Number,
    required: true
  },
  archivedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("MonthEndBalance", monthEndBalanceSchema);
