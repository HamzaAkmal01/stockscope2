const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "API Log routes working" });
});

module.exports = router;