const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
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
  },
  date: {
    type: Date,
    default: Date.now
  },
  month: {
    type: String, // format: "YYYY-MM"
    required: true
  }
}, { timestamps: true });

// ✅ Always set the month string automatically before save
transactionSchema.pre("validate", function (next) {
  if (this.date) {
    this.month = new Date(this.date).toISOString().slice(0, 7);
  } else {
    this.month = new Date().toISOString().slice(0, 7);
  }
  next();
});

module.exports = mongoose.model("Transaction", transactionSchema);
