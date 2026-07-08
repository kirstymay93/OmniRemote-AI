function processCommand(command) {
  const text = command.toLowerCase();

  if (text.includes("turn on")) {
    return {
      action: "POWER_ON",
      message: "Power on command detected"
    };
  }

  if (text.includes("turn off")) {
    return {
      action: "POWER_OFF",
      message: "Power off command detected"
    };
  }

  if (text.includes("restart")) {
    return {
      action: "RESTART",
      message: "Restart command detected"
    };
  }

  return {
    action: "UNKNOWN",
    message: "Command not recognised"
  };
}

module.exports = {
  processCommand
};