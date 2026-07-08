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
  const devices = load(deviceFile, {
    devices: []
  });

  if (!devices.devices.find(d => d.name === name)) {
    devices.devices.push({
      name,
      type,
      added: new Date().toISOString()
    });
  }

  save(deviceFile, devices);
}

app.get("/", (req,res)=>{
res.send(`
<!DOCTYPE html>
<html>
<body>

<h1>🤖 OmniRemote AI</h1>

<input id="cmd" placeholder="Speak or type command">

<button onclick="send()">Send</button>
<button onclick="listen()">🎤 Voice</button>

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


function listen(){

let SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

let recognition=new SpeechRecognition();

recognition.onresult=function(event){

document.getElementById("cmd").value =
event.results[0][0].transcript;

send();

};

recognition.start();

}

</script>

</body>
</html>
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


// Add device

if(text.startsWith("add ")){

const name=text.replace("add ","");

let type="device";

if(name.includes("light")) type="light";
if(name.includes("tv")) type="tv";
if(name.includes("speaker")) type="speaker";

addDevice(name,type);

return res.json({
action:"DEVICE_ADDED",
device:name,
reply:`${name} saved`
});

}


// Find device

const devices=load(deviceFile,{
devices:[]
});

const device=devices.devices.find(d =>
text.includes(d.name)
);


// Control saved device

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


if(text.includes("time")){

return res.json({
action:"TIME",
reply:new Date().toLocaleString()
});

}


return res.json({
action:"CHAT",
reply:`I heard: ${message}`
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