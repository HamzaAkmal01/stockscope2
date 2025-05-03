const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Risk Analysis routes working" });
});

module.exports = router;