const express = require("express");

const router = express.Router();

router.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      error: "Message required"
    });
  }

  res.json({
    reply: `OmniRemote AI received: ${message}`
  });
});

module.exports = router;