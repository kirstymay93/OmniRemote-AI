const express = require("express");
const router = express.Router();

const { processCommand } = require("../services/commandService");
const { executeAction } = require("../services/deviceService");

router.post("/chat", (req, res) => {
  const { message } = req.body;

  const command = processCommand(message);
  const result = executeAction(command.action);

  res.json({
    message,
    action: command.action,
    response: result
  });
});

module.exports = router;