const RecurringTransaction = require("../models/RecurringTransaction");

const createRecurringTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      title,
      amount,
      type,
      frequency,
      day,
      startDate,
      endDate
    } = req.body;

    const recurring = new RecurringTransaction({
      userId,
      title,
      amount,
      type,
      frequency,
      day,
      startDate,
      endDate
    });

    await recurring.save();
    res.status(201).json({ message: "Recurring rule saved", recurring });
  } catch (err) {
    res.status(500).json({
      message: "Failed to save recurring rule",
      error: err.message
    });
  }
};

const getAllRecurringTransactions = async (req, res) => {
  const rules = await RecurringTransaction.find({ userId: req.user.userId });
  res.status(200).json({ recurring: rules });
};


const updateRecurringTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const updates = req.body;

    const updated = await RecurringTransaction.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Recurring rule not found or not authorized" });
    }

    res.status(200).json({ message: "Recurring rule updated", updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update recurring rule", error: err.message });
  }
};

const deleteRecurringTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const deleted = await RecurringTransaction.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return res.status(404).json({ message: "Recurring rule not found or not authorized" });
    }

    res.status(200).json({ message: "Recurring rule deleted", deleted });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete recurring rule", error: err.message });
  }
};


module.exports = {
  createRecurringTransaction,
  getAllRecurringTransactions,
  updateRecurringTransaction,
  deleteRecurringTransaction
};
