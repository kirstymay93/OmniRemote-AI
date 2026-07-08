const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const memoryFile = "./memory.json";
const deviceFile = "./devices.json";

function load(file, empty) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(empty, null, 2));
  }
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function save(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function saveCommand(command) {
  const memory = load(memoryFile, { users: [], commands: [] });

  memory.commands.push({
    command,
    time: new Date().toISOString()
  });

  save(memoryFile, memory);
}

function saveDevice(name, type) {
  const devices = load(deviceFile, { devices: [] });

  devices.devices.push({
    name,
    type,
    added: new Date().toISOString()
  });

  save(deviceFile, devices);
}

app.get("/", (req, res) => {
  res.send(`
    <h1>🤖 OmniRemote AI</h1>
    <input id="cmd" placeholder="Type command">
    <button onclick="send()">Send</button>
    <pre id="result"></pre>

    <script>
      async function send() {
        const message = document.getElementById("cmd").value;

        const response = await fetch("/ai/chat", {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({message})
        });

        document.getElementById("result").textContent =
          JSON.stringify(await response.json(), null, 2);
      }
    </script>
  `);
});

app.get("/health", (req,res)=>{
  res.json({
    status:"healthy",
    service:"OmniRemote AI"
  });
});

app.post("/ai/chat",(req,res)=>{
  const message = req.body.message || "";
  const text = message.toLowerCase();

  saveCommand(message);

  if(text.startsWith("add ")){
    const device = text.replace("add ","");

    let type="device";
    if(device.includes("light")) type="light";
    if(device.includes("tv")) type="tv";
    if(device.includes("music")) type="music";

    saveDevice(device,type);

    return res.json({
      action:"DEVICE_ADDED",
      reply:`${device} saved`
    });
  }

  if(text.includes("light") && text.includes("on")){
    return res.json({
      action:"LIGHTS_ON",
      reply:"Lights turned on"
    });
  }

  if(text.includes("light") && text.includes("off")){
    return res.json({
      action:"LIGHTS_OFF",
      reply:"Lights turned off"
    });
  }

  if(text.includes("tv")){
    return res.json({
      action:"TV_CONTROL",
      reply:"TV command detected"
    });
  }

  if(text.includes("music")){
    return res.json({
      action:"MUSIC",
      reply:"Music command detected"
    });
  }

  return res.json({
    action:"CHAT",
    reply:`OmniRemote AI received: ${message}`
  });
});

app.get("/memory",(req,res)=>{
  res.json(load(memoryFile,{users:[],commands:[]}));
});

app.get("/devices",(req,res)=>{
  res.json(load(deviceFile,{devices:[]}));
});

const PORT = process.env.PORT || 10000;

app.listen(PORT,"0.0.0.0",()=>{
  console.log(`OmniRemote AI running on port ${PORT}`);
});