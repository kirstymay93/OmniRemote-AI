const fs = require("fs");

function saveDevice(name, type) {
  const file = "devices.json";

  let data = { devices: [] };

  if (fs.existsSync(file)) {
    data = JSON.parse(fs.readFileSync(file));
  }

  data.devices.push({
    name,
    type,
    added: new Date().toISOString()
  });

  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function processCommand(command) {
  const text = command.toLowerCase();

  if (text.startsWith("add ")) {
    const device = text.replace("add ", "");

    let type = "device";

    if (device.includes("light")) type = "light";
    if (device.includes("tv")) type = "tv";
    if (device.includes("music")) type = "music";

    saveDevice(device, type);

    return {
      action: "DEVICE_ADDED",
      message: `${device} saved`
    };
  }

  if (text.includes("light") && text.includes("on")) {
    return {
      action: "LIGHTS_ON",
      message: "Lights turned on"
    };
  }

  if (text.includes("tv") && text.includes("off")) {
    return {
      action: "TV_OFF",
      message: "TV turned off"
    };
  }

  if (text.includes("music")) {
    return {
      action: "MUSIC_PLAY",
      message: "Playing music"
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