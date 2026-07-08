const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

const memoryFile = "./memory.json";
const deviceFile = "./devices.json";

function loadFile(file, empty) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(empty, null, 2));
  }

  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function saveCommand(command) {
  const memory = loadFile(memoryFile, {
    users: [],
    commands: []
  });

  memory.commands.push({
    command,
    time: new Date().toISOString()
  });

  fs.writeFileSync(memoryFile, JSON.stringify(memory, null, 2));
}

function saveDevice(name, type) {
  const devices = loadFile(deviceFile, {
    devices: []
  });

  devices.devices.push({
    name,
    type,
    added: new Date().toISOString()
  });

  fs.writeFileSync(deviceFile, JSON.stringify(devices, null, 2));
}

app.get("/", (req, res) => {
  res.send("OmniRemote AI running");
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "OmniRemote AI"
  });
});

app.post("/ai/chat", (req, res) => {
  const message = req.body.message || "";
  const text = message.toLowerCase();

  saveCommand(message);

  // Add device memory
  if (text.startsWith("add ")) {
    const device = text.replace("add ", "");

    let type = "device";

    if (device.includes("light")) type = "light";
    if (device.includes("tv")) type = "tv";
    if (device.includes("music")) type = "music";

    saveDevice(device, type);

    return res.json({
      action: "DEVICE_ADDED",
      reply: `${device} saved`
    });
  }

  if (text.includes("light") && text.includes("on")) {
    return res.json({
      action: "LIGHTS_ON",
      reply: "Lights turned on"
    });
  }

  if (text.includes("light") && text.includes("off")) {
    return res.json({
      action: "LIGHTS_OFF",
      reply: "Lights turned off"
    });
  }

  if (text.includes("tv") && text.includes("on")) {
    return res.json({
      action: "TV_ON",
      reply: "TV turned on"
    });
  }

  if (text.includes("tv") && text.includes("off")) {
    return res.json({
      action: "TV_OFF",
      reply: "TV turned off"
    });
  }

  if (text.includes("music")) {
    return res.json({
      action: "MUSIC_PLAY",
      reply: "Playing music"
    });
  }

  if (text.includes("hello") || text.includes("hi")) {
    return res.json({
      action: "CHAT",
      reply: "Hello, I am OmniRemote AI"
    });
  }

  if (text.includes("status")) {
    return res.json({
      action: "STATUS",
      reply: "All systems online"
    });
  }

  res.json({
    action: "UNKNOWN",
    reply: `OmniRemote AI received: ${message}`
  });
});

app.get("/memory", (req, res) => {
  res.json(loadFile(memoryFile, {
    users: [],
    commands: []
  }));
});

app.get("/devices", (req, res) => {
  res.json(loadFile(deviceFile, {
    devices: []
  }));
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`OmniRemote AI running on port ${PORT}`);
});