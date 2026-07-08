const express = require("express");
const router = express.Router();
const { remember, getMemory } = require("../services/memoryService");

router.post("/chat", (req, res) => {
  const { message } = req.body;

  if (message.includes("remember")) {
    remember({
      text: message,
      date: new Date()
    });

    return res.json({
      reply: "I remembered that."
    });
  }

  res.json({
    reply: `OmniRemote AI received: ${message}`,
    memory: getMemory()
  });
});

module.exports = router;