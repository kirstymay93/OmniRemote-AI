function processCommand(command) {
  const text = command.toLowerCase();

  if (text.includes("light") && text.includes("on")) {
    return {
      action: "LIGHTS_ON",
      message: "Lights turned on"
    };
  }

  if (text.includes("light") && text.includes("off")) {
    return {
      action: "LIGHTS_OFF",
      message: "Lights turned off"
    };
  }

  if (text.includes("tv") && text.includes("on")) {
    return {
      action: "TV_ON",
      message: "TV turned on"
    };
  }

  if (text.includes("tv") && text.includes("off")) {
    return {
      action: "TV_OFF",
      message: "TV turned off"
    };
  }

  if (text.includes("music") || text.includes("play")) {
    return {
      action: "MUSIC_PLAY",
      message: "Playing music"
    };
  }

  if (text.includes("restart")) {
    return {
      action: "RESTART",
      message: "Restart command detected"
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