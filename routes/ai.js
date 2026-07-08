const express = require("express");
const router = express.Router();
const { remember, getMemory } = require("../services/memoryService");

router.post("/chat", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      error: "Message required"
    });
  }

  const text = message.toLowerCase();

  // Save memory
  if (text.startsWith("remember")) {
    remember({
      text: message.replace("remember", "").trim(),
      date: new Date()
    });

    return res.json({
      reply: "I will remember that."
    });
  }

  // Recall memory
  if (text.includes("what do you remember") || text.includes("memory")) {
    return res.json({
      reply: "Here is what I remember:",
      memory: getMemory()
    });
  }

  // Normal chat
  res.json({
    reply: `OmniRemote AI received: ${message}`
  });
});

module.exports = router;