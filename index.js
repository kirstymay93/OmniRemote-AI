const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

const memoryFile = "./memory.json";

function loadMemory() {
  if (!fs.existsSync(memoryFile)) {
    return { users: [], commands: [] };
  }

  return JSON.parse(fs.readFileSync(memoryFile, "utf8"));
}

function saveCommand(command) {
  const memory = loadMemory();

  memory.commands.push({
    command,
    time: new Date().toISOString()
  });

  fs.writeFileSync(memoryFile, JSON.stringify(memory, null, 2));
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

  saveCommand(message);

  const text = message.toLowerCase();

  if (text.includes("turn on")) {
    return res.json({
      action: "POWER_ON",
      reply: "Power on command detected"
    });
  }

  if (text.includes("turn off")) {
    return res.json({
      action: "POWER_OFF",
      reply: "Power off command detected"
    });
  }

  res.json({
    action: "CHAT",
    reply: `OmniRemote AI received: ${message}`
  });
});

app.get("/memory", (req, res) => {
  res.json(loadMemory());
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`OmniRemote AI running on port ${PORT}`);
});

const fs = require("fs");

function saveDevice(name, type) {
  let data = JSON.parse(fs.readFileSync("devices.json"));

  data.devices.push({
    name: name,
    type: type,
    added: new Date().toISOString()
  });

  fs.writeFileSync(
    "devices.json",
    JSON.stringify(data, null, 2)
  );
}