const fetch = require("node-fetch");

async function controlHome(device, action) {
  const url = process.env.HOME_ASSISTANT_URL;
  const token = process.env.HOME_ASSISTANT_TOKEN;

  const response = await fetch(`${url}/api/services/homeassistant/${action}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      entity_id: device
    })
  });

  return response.json();
}

module.exports = {
  controlHome
};