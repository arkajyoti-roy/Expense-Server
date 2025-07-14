const MonthEndBalance = require("../models/MonthEndBalance");

exports.getMonthlySnapshot = async (req, res) => {
  try {
    const { userId, month } = req.params;

    const snapshot = await MonthEndBalance.findOne({ userId, month });
    if (!snapshot) {
      return res.status(404).json({ message: "No snapshot found for this user and month." });
    }

    res.status(200).json(snapshot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
