const express = require("express");
const router = express.Router();

router.post("/chat", (req, res) => {
  const { message } = req.body;

  res.json({
    reply: `OmniRemote AI received: ${message}`
  });
});

module.exports = router;