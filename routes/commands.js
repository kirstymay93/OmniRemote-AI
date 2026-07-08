const express = require("express");
const { processCommand } = require("../services/commandService");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "Command system online"
  });
});

router.post("/", (req, res) => {
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({
      error: "Command required"
    });
  }

  const result = processCommand(command);

  res.json(result);
});

module.exports = router;