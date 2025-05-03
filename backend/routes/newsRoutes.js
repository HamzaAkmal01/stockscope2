const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "News routes working" });
});

module.exports = router;