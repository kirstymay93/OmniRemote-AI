const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>OmniRemote AI</title>
      <style>
        body {
          font-family: Arial;
          text-align: center;
          padding: 40px;
        }
        input, button {
          padding: 10px;
          font-size: 16px;
        }
      </style>
    </head>

    <body>
      <h1>🤖 OmniRemote AI</h1>

      <input id="message" placeholder="Type command">
      <button onclick="send()">Send</button>

      <h3 id="reply"></h3>

      <script>
        async function send() {
          const message =
            document.getElementById("message").value;

          const response = await fetch("/ai/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
          });

          const data = await response.json();

          document.getElementById("reply").innerText =
            JSON.stringify(data);
        }
      </script>
    </body>
    </html>
  `);
});

app.post("/ai/chat", (req, res) => {
  const message = req.body.message || "";

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

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "OmniRemote AI"
  });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`OmniRemote AI running on port ${PORT}`);
});