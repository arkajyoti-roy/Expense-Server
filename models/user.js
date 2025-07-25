const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: { 
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

// module.exports = mongoose.model("User", userSchema);
module.exports = mongoose.models.User || mongoose.model("User", userSchema);

