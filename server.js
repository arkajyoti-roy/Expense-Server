const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db");
const userRoutes = require("./routes/userRoute");
const budgetRoutes = require("./routes/budgetRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const recurringRoutes = require("./routes/recurringRoutes");
const generateRecurringTransactions = require("./utils/generateRecurring"); // ✅ only once
const archiveRoutes = require("./routes/monthArchiveRoutes");
const cron = require("node-cron");
require("./cron/archiveMonthly");

dotenv.config();
const app = express();
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173","https://expensetracker-alpha-three.vercel.app", "http://localhost:5174", "https://expense-client-qroy.vercel.app", "https://keep-server-alive-render-u2jq.vercel.app"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true
}));

// DB connection

// Routes
app.use("/api/users", userRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/recurring", recurringRoutes);
app.use("/api/month-archive", archiveRoutes);

app.get("/status", (req, res) => {
  res.status(200).send("✅ Server is alive!");
});





app.post("/manual-archive", async (req, res) => {
  const { userId, monthKey, openingBalance } = req.body;

  try {
    await archiveMonthEndSnapshot(userId, monthKey, openingBalance);
    res.status(200).send("Snapshot archived manually.");
  } catch (err) {
    res.status(500).send("Error archiving: " + err.message);
  }
});
const archiveMonthEndSnapshot = require("./utils/archiveMonthEndSnapshot");

  // kkk?

// Trigger auto-debit once at startup (optional)
generateRecurringTransactions();

// ✅ Run every day at 1:00 AM
cron.schedule("0 1 * * *", () => {
  generateRecurringTransactions();
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
