import express from "express";

const app = express();
app.use(express.json());

// Test route (checks server is working)
app.get("/", (req, res) => {
  res.send("OmniRemote AI server is running");
});

// Chat route (we will connect AI next)
app.post("/chat", (req, res) => {
  const message = req.body.message;

  res.json({
    reply: "You said: " + message
  });
});

app.listen(3000, () => {
  console.log("AI server running on port 3000");
});