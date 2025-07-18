const RecurringTransaction = require("../models/RecurringTransaction");
const Transaction = require("../models/transaction");

const generateRecurring = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayWeekday = today.toLocaleDateString("en-US", { weekday: "long" });
    const todayDateOnly = today.toDateString();

    const rules = await RecurringTransaction.find();

    for (const rule of rules) {
      const {
        frequency,
        startsOn,
        weeklyDay,
        lastGenerated,
        userId,
        title,
        amount,
        type
      } = rule;

      if (!startsOn || isNaN(new Date(startsOn))) continue;

      const startDate = new Date(startsOn);
      startDate.setHours(0, 0, 0, 0);
      if (startDate > today) continue;

      let transactionDate = today;
      let shouldGenerate = false;

      const lastGenDate = lastGenerated ? new Date(lastGenerated) : null;
      if (lastGenDate) lastGenDate.setHours(0, 0, 0, 0);

      // 🔁 WEEKLY Logic
      if (frequency === "weekly") {
        const isFirstRun = today.toDateString() === startDate.toDateString();
        const isRecurring = today > startDate && todayWeekday === weeklyDay;
        const alreadyRun = lastGenDate?.toDateString() === today.toDateString();

        if ((isFirstRun || isRecurring) && !alreadyRun) {
          transactionDate = today;
          shouldGenerate = true;
        }
      }

      // 🗓️ MONTHLY Logic
      if (frequency === "monthly") {
        const scheduledDay = startDate.getDate();
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const effectiveDay = Math.min(scheduledDay, lastDayOfMonth);

        const fallbackDate = new Date(today.getFullYear(), today.getMonth(), effectiveDay);
        fallbackDate.setHours(0, 0, 0, 0);

        const alreadyRunForDate = lastGenDate?.toDateString() === fallbackDate.toDateString();

        if (!alreadyRunForDate && today.toDateString() === fallbackDate.toDateString()) {
          transactionDate = fallbackDate;
          shouldGenerate = true;
        }
      }

      // 💸 Create transaction
      if (shouldGenerate) {
        const formattedDate = transactionDate.toISOString().split("T")[0]; // "YYYY-MM-DD"

        await Promise.all([
          Transaction.create({
            userId,
            title,
            amount,
            type,
            description: `Recurring: ${title}`,
            date: formattedDate,
            month: `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, "0")}`,
            isAutoGenerated: true
          }),
          RecurringTransaction.updateOne(
            { _id: rule._id },
            { lastGenerated: transactionDate }
          )
        ]);
      }
    }

    console.log(`✅ Recurring transactions processed for ${todayDateOnly}`);
  } catch (err) {
    console.error("❌ Failed to generate recurring transactions:", err.message);
  }
};

module.exports = generateRecurring;
