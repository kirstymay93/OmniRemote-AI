const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("OmniRemote AI running");
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "OmniRemote AI"
  });
});

app.post("/ai", (req, res) => {
  const { command } = req.body;

  res.json({
    received: command,
    response: `OmniRemote AI processed: ${command}`
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});