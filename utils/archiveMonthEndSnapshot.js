const MonthEndBalance = require("../models/MonthEndBalance");
const Transaction = require("../models/transaction");

/**
 * Archives month-end snapshot for a given user and month.
 * Filters transactions using a date range instead of relying on a 'month' field.
 * @param {String} userId - The user's ObjectId
 * @param {String} monthKey - Format "YYYY-MM" (e.g., "2025-07")
 * @param {Number} openingBalance - User's opening balance for that month
 */
const archiveMonthEndSnapshot = async (userId, monthKey, openingBalance) => {
  try {
    // Define date range for the given month
    const startDate = new Date(`${monthKey}-01T00:00:00.000Z`);
    const endDate = new Date(`${monthKey}-31T23:59:59.999Z`);

    // Find all transactions within the month
    const transactions = await Transaction.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).select("date type amount description");

    // Calculate totals
    const totalDebit = transactions
      .filter(t => t.type === "debit")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalCredit = transactions
      .filter(t => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0);

    const leftoverBalance = openingBalance + totalCredit - totalDebit;

    // Format each transaction
    const formattedTransactions = transactions.map(t => ({
      date: typeof t.date === "string"
        ? t.date
        : new Date(t.date).toISOString().split("T")[0],
      type: t.type,
      amount: t.amount,
      description: t.description
    }));

    // Check if archive already exists
    const alreadyArchived = await MonthEndBalance.findOne({ userId, month: monthKey });
    if (alreadyArchived) {
      console.log(`📁 Snapshot already exists for user ${userId}, month ${monthKey}`);
      return;
    }

    // Create snapshot
    await MonthEndBalance.create({
      userId,
      month: monthKey,
      openingBalance,
      leftoverBalance,
      transactions: formattedTransactions,
      archivedAt: new Date()
    });

    console.log(`✅ Month-end snapshot stored for ${userId}, month ${monthKey}`);
  } catch (err) {
    console.error("❌ Failed to archive month-end snapshot:", err.message);
  }
};

module.exports = archiveMonthEndSnapshot;
