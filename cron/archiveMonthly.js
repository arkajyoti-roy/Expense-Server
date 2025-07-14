const cron = require("node-cron");
const User = require("../models/User");
const archiveMonthEndSnapshot = require("../utils/archiveMonthEndSnapshot");

cron.schedule("30 0 1 * *", async () => {
  const now = new Date();
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1);
  const monthKey = `${previousMonth.getFullYear()}-${String(previousMonth.getMonth() + 1).padStart(2, "0")}`;

  try {
    const users = await User.find();

    for (const user of users) {
      const openingBalance = 5000; // Replace with real logic
      await archiveMonthEndSnapshot(user._id, monthKey, openingBalance);
    }

    console.log(`✅ Archived monthly snapshots for ${monthKey}`);
  } catch (err) {
    console.error("❌ Cron error:", err.message);
  }
});
