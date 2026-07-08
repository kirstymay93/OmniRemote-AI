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

  if (text.includes("lights")) {
    return {
      action: "LIGHTS",
      message: "Lights command detected"
    };
  }

  if (text.includes("tv")) {
    return {
      action: "TV",
      message: "TV command detected"
    };
  }

  if (text.includes("music")) {
    return {
      action: "MUSIC",
      message: "Music command detected"
    };
  }

  if (text.includes("hello") || text.includes("hi")) {
    return {
      action: "CHAT",
      message: "Hello, I am OmniRemote AI"
    };
  }

  if (text.includes("status")) {
    return {
      action: "STATUS",
      message: "All systems online"
    };
  }

  if (text.includes("time")) {
    return {
      action: "TIME",
      message: new Date().toISOString()
    };
  }

  return {
    action: "UNKNOWN",
    message: "I don't understand that command yet"
  };
}

module.exports = {
  processCommand
};