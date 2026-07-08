const fs = require("fs");

function readFile(file, fallback) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(fallback, null, 2));
  }
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeFile(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {
  readFile,
  writeFile
};
