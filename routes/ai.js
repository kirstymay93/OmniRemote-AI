const express = require("express");
const router = express.Router();

const { processCommand } = require("../services/commandService");
const { controlDevice } = require("../services/deviceController");

router.post("/chat", (req, res) => {
  const { message, device = "default device" } = req.body;

  const command = processCommand(message);

  const result = controlDevice(
    command.action,
    device
  );

  res.json(result);
});

module.exports = router;