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

function remember(command) {
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
      status: "OFF",
      added: new Date().toISOString()
    });
  }

  save(deviceFile, data);
}

function updateDevice(name, status) {
  const data = load(deviceFile, {
    devices: []
  });

  const device = data.devices.find(d => d.name === name);

  if (device) {
    device.status = status;
  }

  save(deviceFile, data);
}


app.get("/", (req,res)=>{
res.send(`
<h1>🤖 OmniRemote AI</h1>

<input id="cmd" placeholder="Command">
<button onclick="send()">Send</button>
<button onclick="voice()">🎤 Voice</button>

<pre id="out"></pre>

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

let data=await r.json();

document.getElementById("out").textContent=
JSON.stringify(data,null,2);

speechSynthesis.speak(
new SpeechSynthesisUtterance(data.reply)
);

}

function voice(){

let SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

let r=new SpeechRecognition();

r.onresult=function(e){
document.getElementById("cmd").value =
e.results[0][0].transcript;

send();
};

r.start();

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

remember(message);


// ADD DEVICE

if(text.startsWith("add ")){

const name=text.replace("add ","");

let type="device";

if(name.includes("light")) type="light";
if(name.includes("tv")) type="tv";

addDevice(name,type);

return res.json({
action:"DEVICE_ADDED",
device:name,
reply:`${name} saved`
});

}


// FIND DEVICE

const devices=load(deviceFile,{
devices:[]
});

const device=devices.devices.find(d =>
text.includes(d.name)
);


// DEVICE ON ACTION

if(device && text.includes("turn on")){

updateDevice(device.name,"ON");

return res.json({
action:"DEVICE_ON",
device:device.name,
status:"ON",
reply:`Turning on ${device.name}`
});

}


// DEVICE OFF ACTION

if(device && text.includes("turn off")){

updateDevice(device.name,"OFF");

return res.json({
action:"DEVICE_OFF",
device:device.name,
status:"OFF",
reply:`Turning off ${device.name}`
});

}


// STATUS

if(text.includes("status")){

return res.json({
action:"SYSTEM_STATUS",
reply:"OmniRemote AI is online"
});

}


return res.json({
action:"CHAT",
reply:`I heard: ${message}`
});

});


app.get("/devices",(req,res)=>{
res.json(load(deviceFile,{
devices:[]
}));
});


app.get("/memory",(req,res)=>{
res.json(load(memoryFile,{
users:[],
commands:[]
}));
});


const PORT=process.env.PORT || 10000;

app.listen(PORT,"0.0.0.0",()=>{
console.log(`OmniRemote AI running on port ${PORT}`);
});