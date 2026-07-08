const { readFile, writeFile } = require("../utils/fileUtils");

const memoryFile = "./memory.json";

function saveCommand(command) {
  const memory = readFile(memoryFile, {
    users: [],
    commands: []
  });

  memory.commands.push({
    command,
    time: new Date().toISOString()
  });

  writeFile(memoryFile, memory);
}

function getMemory() {
  return readFile(memoryFile, {
    users: [],
    commands: []
  });
}

// Retaining existing functionality, adapting to fileUtils
function remember(item) {
  const memory = getMemory(); // Use getMemory to read
  memory.users.push(item);
  writeFile(memoryFile, memory);
  return "Memory saved";
}

module.exports = {
  saveCommand,
  getMemory,
  remember
};
