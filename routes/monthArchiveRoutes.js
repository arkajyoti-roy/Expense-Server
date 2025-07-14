const express = require("express");
const router = express.Router();
const { getMonthlySnapshot } = require("../controllers/monthArchiveController");
const auth = require("../middleware/authMiddleware");

router.get("/snapshot/:userId/:month", auth, getMonthlySnapshot);

module.exports = router;
