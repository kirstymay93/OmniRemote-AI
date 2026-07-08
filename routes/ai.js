const express = require("express");

const router = express.Router();

router.get("/chat", (req, res) => {
  res.json({
    message: "OmniRemote AI chat endpoint is working"
  });
});

router.post("/chat", async (req, res) => {
  const { message } = req.body;

  res.json({
    reply: `OmniRemote AI received: ${message}`
  });
});

module.exports = router;