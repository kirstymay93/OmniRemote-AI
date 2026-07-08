const fetch = require("node-fetch");

const WEBHOOK_URL = "https://webhook.site/080146d1-5545-49cf-9347-4a42378f9774";

async function sendWebhook(device, action) {
  const payload = {
    device,
    action,
    time: new Date().toISOString()
  };

  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        timeout: 5000 // 5 seconds timeout
      });

      if (!response.ok) {
        if (response.status >= 500) {
          throw new Error(`Server error: ${response.status}`);
        } else {
          const errorText = await response.text();
          throw new Error(`Client error: ${response.status} - ${errorText}`);
        }
      }

      const result = await response.json();
      return {
        sent: true,
        payload,
        syncResult: result
      };
    } catch (error) {
      attempt++;
      console.error(`Attempt ${attempt} failed: ${error.message}`);
      if (attempt >= maxRetries) {
        throw new Error(`External sync failed after ${maxRetries} attempts: ${error.message}`);
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

module.exports = {
  sendWebhook
};
