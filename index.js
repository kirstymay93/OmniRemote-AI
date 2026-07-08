const express = require("express");

const deviceStateService = require("./services/deviceStateService");
const memoryService = require("./services/memoryService");
const webhookService = require("./services/webhookService");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("OmniRemote AI running");
});

app.post("/ai/chat", async (req, res) => {
  const message = req.body.message || "";
  const text = message.toLowerCase();

  memoryService.saveCommand(message);

  if (text.startsWith("add ")) {
    const deviceName = text.replace("add ", "");
    let type = "device";

    if (deviceName.includes("light")) type = "light";
    if (deviceName.includes("tv")) type = "tv";

    deviceStateService.addDevice(deviceName, type);

    return res.json({
      action: "DEVICE_ADDED",
      device: deviceName,
      reply: `${deviceName} saved`
    });
  }

  let devices = deviceStateService.getDevices();
  let found = devices.find(d => text.includes(d.name));

  // TV
  if (text.includes("tv")) {
    let action = text.includes("turn on") ? "TV_ON" : "TV_OFF";
    try {
      let hook = await webhookService.sendWebhook("tv", action);
      return res.json({
        action,
        webhook: hook,
        reply: action === "TV_ON" ? "Turning on TV" : "Turning off TV"
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // PHONE
  if (text.includes("phone") || text.includes("alert")) {
    try {
      let hook = await webhookService.sendWebhook("phone", "NOTIFICATION");
      return res.json({
        action: "PHONE_ALERT",
        webhook: hook,
        reply: "Phone alert sent"
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // HOME ASSISTANT
  if (text.includes("home assistant")) {
    try {
      let hook = await webhookService.sendWebhook("home assistant", message);
      return res.json({
        action: "HOME_ASSISTANT",
        webhook: hook,
        reply: "Home Assistant command sent"
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // DEVICES
  if (found && text.includes("turn on")) {
    deviceStateService.setStatus(found.name, "ON");
    try {
      let hook = await webhookService.sendWebhook(found.name, "ON");
      return res.json({
        action: "DEVICE_ON",
        device: found.name,
        status: "ON",
        webhook: hook,
        reply: `Turning on ${found.name}`
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (found && text.includes("turn off")) {
    deviceStateService.setStatus(found.name, "OFF");
    try {
      let hook = await webhookService.sendWebhook(found.name, "OFF");
      return res.json({
        action: "DEVICE_OFF",
        device: found.name,
        status: "OFF",
        webhook: hook,
        reply: `Turning off ${found.name}`
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.json({
    action: "CHAT",
    reply: `I heard: ${message}`
  });
});

app.get("/devices", (req, res) => {
  res.json(deviceStateService.getDevices());
});

app.get("/memory", (req, res) => {
  res.json(memoryService.getMemory());
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`OmniRemote AI running on port ${PORT}`);
});
