function controlDevice(action, device) {
  return {
    device,
    action,
    status: "sent",
    message: `${device} received ${action}`
  };
}

module.exports = {
  controlDevice
};