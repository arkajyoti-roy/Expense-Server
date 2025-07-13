const mongoose = require("mongoose");
const dotenv = require("dotenv");
const generateRecurring = require("./utils/generateRecurring");

dotenv.config();

const DB_URL = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("✅ Db Connected");

    mongoose.connection.once("open", async () => {
      try {
        await generateRecurring();
        console.log("🔁 Recurring deduction complete");
      } catch (err) {
        console.error("❌ Error during recurring processing:", err.message);
      }
    });
  } catch (err) {
    console.error("❌ Db Connection Failed:", err.message);
    process.exit(1); // stop the server on DB fail
  }
};

module.exports = connectDB;
