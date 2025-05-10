const express = require("express");
const router = express.Router();

// Basic route for testing
router.get("/", (req, res) => {
  res.json({ message: "User routes working" });
});

module.exports = router;

