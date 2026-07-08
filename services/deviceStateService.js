const { readFile, writeFile } = require("../utils/fileUtils");

const deviceFile = "./devices.json";

function addDevice(name, type) {
  const data = readFile(deviceFile, { devices: [] });
  if (!data.devices.find(d => d.name === name)) {
    data.devices.push({
      id: Date.now(),
      name,
      type,
      status: "OFF"
    });
  }
  writeFile(deviceFile, data);
}

function setStatus(name, status) {
  const data = readFile(deviceFile, { devices: [] });
  const device = data.devices.find(d => d.name === name);
  if (device) {
    device.status = status;
  }
  writeFile(deviceFile, data);
}

function getDevices() {
  return readFile(deviceFile, { devices: [] }).devices;
}

module.exports = {
  addDevice,
  setStatus,
  getDevices
};
