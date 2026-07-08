const fs = require("fs");

const file = "./memory.json";

function readMemory() {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function saveMemory(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function remember(item) {
  const memory = readMemory();

  memory.users.push(item);

  saveMemory(memory);

  return "Memory saved";
}

function getMemory() {
  return readMemory();
}

module.exports = {
  remember,
  getMemory
};