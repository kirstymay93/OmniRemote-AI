function executeAction(action) {
  switch (action) {
    case "POWER_ON":
      return "Device powered on";

    case "POWER_OFF":
      return "Device powered off";

    case "RESTART":
      return "Device restarting";

    default:
      return "No device action available";
  }
}

module.exports = {
  executeAction
};