const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db");
const userRoutes = require("./routes/userRoute");
const budgetRoutes = require("./routes/budgetRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const recurringRoutes = require("./routes/recurringRoutes");
const generateRecurringTransactions = require("./utils/generateRecurring"); // ✅ only once
const cron = require("node-cron");

dotenv.config();
const app = express();
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "https://expensetracker-one-psi.vercel.app"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true
}));

// DB connection

// Routes
app.use("/api/users", userRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/recurring", recurringRoutes);

// Trigger auto-debit once at startup (optional)
generateRecurringTransactions();

// ✅ Run every day at 1:00 AM
cron.schedule("0 1 * * *", () => {
  generateRecurringTransactions();
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
