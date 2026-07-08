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

function rememberCommand(command) {
  const memory = load(memoryFile, {
    users: [],
    commands: []
  });

  memory.commands.push({
    command,
    time: new Date().toISOString()
  });

  save(memoryFile, memory);
}

function addDevice(name, type) {
  const data = load(deviceFile, {
    devices: []
  });

  if (!data.devices.find(d => d.name === name)) {
    data.devices.push({
      name,
      type,
      added: new Date().toISOString()
    });
  }

  save(deviceFile, data);
}

app.get("/", (req,res)=>{
  res.send(`
  <h1>🤖 OmniRemote AI</h1>

  <input id="cmd" placeholder="Type command">
  <button onclick="send()">Send</button>

  <pre id="output"></pre>

  <script>
  async function send(){
    let message=document.getElementById("cmd").value;

    let r=await fetch("/ai/chat",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({message})
    });

    document.getElementById("output").innerHTML =
      JSON.stringify(await r.json(),null,2);
  }
  </script>
  `);
});


app.get("/health",(req,res)=>{
  res.json({
    status:"healthy",
    service:"OmniRemote AI"
  });
});


app.post("/ai/chat",(req,res)=>{

  const message=req.body.message || "";
  const text=message.toLowerCase();

  rememberCommand(message);

  // Add device
  if(text.startsWith("add ")){

    const name=text.replace("add ","");

    let type="device";

    if(name.includes("light")) type="light";
    if(name.includes("tv")) type="tv";
    if(name.includes("music")) type="music";

    addDevice(name,type);

    return res.json({
      action:"DEVICE_ADDED",
      device:name,
      reply:`${name} saved`
    });
  }


  const devices=load(deviceFile,{
    devices:[]
  });


  const device=devices.devices.find(d =>
    text.includes(d.name)
  );


  if(device && text.includes("turn on")){
    return res.json({
      action:"DEVICE_ON",
      device:device.name,
      reply:`Turning on ${device.name}`
    });
  }


  if(device && text.includes("turn off")){
    return res.json({
      action:"DEVICE_OFF",
      device:device.name,
      reply:`Turning off ${device.name}`
    });
  }


  if(text.includes("hello") || text.includes("hi")){
    return res.json({
      action:"CHAT",
      reply:"Hello, I am OmniRemote AI"
    });
  }


  if(text.includes("status")){
    return res.json({
      action:"STATUS",
      reply:"All systems online"
    });
  }


  return res.json({
    action:"UNKNOWN",
    reply:`I received: ${message}`
  });

});


app.get("/memory",(req,res)=>{
  res.json(load(memoryFile,{
    users:[],
    commands:[]
  }));
});


app.get("/devices",(req,res)=>{
  res.json(load(deviceFile,{
    devices:[]
  }));
});


const PORT=process.env.PORT || 10000;

app.listen(PORT,"0.0.0.0",()=>{
 console.log(`OmniRemote AI running on port ${PORT}`);
});