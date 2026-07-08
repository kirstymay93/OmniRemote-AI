const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const WEBHOOK_URL =
"https://webhook.site/080146d1-5545-49cf-9347-4a42378f9774";

const memoryFile = "./memory.json";
const deviceFile = "./devices.json";


function readFile(file, fallback) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(fallback, null, 2));
  }

  return JSON.parse(fs.readFileSync(file, "utf8"));
}


function writeFile(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}


function saveCommand(command) {
  const memory = readFile(memoryFile, {
    users: [],
    commands: []
  });

  memory.commands.push({
    command,
    time: new Date().toISOString()
  });

  writeFile(memoryFile, memory);
}


function addDevice(name, type) {

  const data = readFile(deviceFile, {
    devices: []
  });

  if (!data.devices.find(d => d.name === name)) {

    data.devices.push({
      id: Date.now(),
      name,
      type,
      status: "OFF"
    });

  }

  writeFile(deviceFile, data);
}


function setStatus(name, status) {

  const data = readFile(deviceFile, {
    devices: []
  });

  const device = data.devices.find(
    d => d.name === name
  );

  if (device) {
    device.status = status;
  }

  writeFile(deviceFile, data);
}


async function sendWebhook(device, action) {

  const payload = {
    device,
    action,
    time: new Date().toISOString()
  };


  try {

    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });


    return {
      sent: true,
      payload
    };


  } catch (error) {

    return {
      sent: false,
      error: error.message
    };

  }
}



app.get("/", (req,res)=>{

res.send("OmniRemote AI running");

});



app.post("/ai/chat", async (req,res)=>{


const message =
req.body.message || "";

const text =
message.toLowerCase();


saveCommand(message);



if(text.startsWith("add ")) {

const device =
text.replace("add ","");


let type="device";

if(device.includes("light"))
type="light";

if(device.includes("tv"))
type="tv";


addDevice(device,type);


return res.json({

action:"DEVICE_ADDED",

device,

reply:`${device} saved`

});

}





let devices =
readFile(deviceFile,{devices:[]});


let found =
devices.devices.find(d =>
text.includes(d.name)
);




// TV

if(text.includes("tv")) {

let action =
text.includes("turn on")
? "TV_ON"
: "TV_OFF";


let hook =
await sendWebhook(
"tv",
action
);


return res.json({

action,

webhook:hook,

reply:
action === "TV_ON"
? "Turning on TV"
: "Turning off TV"

});

}




// PHONE

if(text.includes("phone") ||
text.includes("alert")) {


let hook =
await sendWebhook(
"phone",
"NOTIFICATION"
);


return res.json({

action:"PHONE_ALERT",

webhook:hook,

reply:"Phone alert sent"

});

}





// HOME ASSISTANT

if(text.includes("home assistant")) {


let hook =
await sendWebhook(
"home assistant",
message
);


return res.json({

action:"HOME_ASSISTANT",

webhook:hook,

reply:"Home Assistant command sent"

});

}





// DEVICES

if(found && text.includes("turn on")) {


setStatus(
found.name,
"ON"
);


let hook =
await sendWebhook(
found.name,
"ON"
);


return res.json({

action:"DEVICE_ON",

device:found.name,

status:"ON",

webhook:hook,

reply:`Turning on ${found.name}`

});

}





if(found && text.includes("turn off")) {


setStatus(
found.name,
"OFF"
);


let hook =
await sendWebhook(
found.name,
"OFF"
);


return res.json({

action:"DEVICE_OFF",

device:found.name,

status:"OFF",

webhook:hook,

reply:`Turning off ${found.name}`

});

}





res.json({

action:"CHAT",

reply:`I heard: ${message}`

});


});




app.get("/devices",(req,res)=>{

res.json(
readFile(deviceFile,{devices:[]})
);

});



app.get("/memory",(req,res)=>{

res.json(
readFile(memoryFile,{
users:[],
commands:[]
})
);

});



const PORT =
process.env.PORT || 10000;


app.listen(PORT,"0.0.0.0",()=>{

console.log(
`OmniRemote AI running on port ${PORT}`
);

});