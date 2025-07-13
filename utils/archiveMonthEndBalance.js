const Budget = require("../models/budget");
const MonthEndBalance = require("../models/MonthEndBalance");

const archiveMonthEndBalance = async () => {
  const today = new Date();
  const previousMonthDate = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of previous month
  const monthKey = `${previousMonthDate.getFullYear()}-${String(previousMonthDate.getMonth() + 1).padStart(2, "0")}`;

  const budgets = await Budget.find({ month: monthKey });

  for (const budget of budgets) {
    await MonthEndBalance.create({
      userId: budget.userId,
      month: monthKey,
      openingBalance: budget.openingBalance,
      leftoverBalance: budget.currentBalance
    });
  }

  console.log(`✅ Archived balances for ${monthKey}`);
};

module.exports = archiveMonthEndBalance;
