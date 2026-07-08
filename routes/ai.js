const express = require("express");
const router = express.Router();
const { processCommand } = require("../services/commandService");

router.post("/chat", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      error: "Message required"
    });
  }

  const command = processCommand(message);

  res.json({
    reply: command.message,
    action: command.action
  });
});

module.exports = router;