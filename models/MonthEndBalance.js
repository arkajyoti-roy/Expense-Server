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
  transactions: [
    {
      date: {
        type: String, // Format: "YYYY-MM-DD"
        required: true
      },
      type: {
        type: String, // "credit" or "debit"
        enum: ["credit", "debit"],
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      description: {
        type: String,
        default: ""
      }
    }
  ],
  archivedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.MonthEndBalance || mongoose.model("MonthEndBalance", monthEndBalanceSchema);
