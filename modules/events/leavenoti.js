module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "1.0.0",
  credits: "Mirai Team",
  description: "left notification",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.run = async function({ api, event, Users, Threads }) {
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
  const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { join } =  global.nodemodule["path"];
  const axios = global.nodemodule["axios"];
    const request = global.nodemodule["request"];
    const fs = global.nodemodule["fs-extra"];
  const { threadID } = event;
  const data = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;
  const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
  const type = (event.author == event.logMessageData.leftParticipantFbId) ? " " : "\n\nadministrator kicked out the person!!";
  (typeof data.customLeave == "undefined") ? msg = "Goodbye {name}  tanga² kapa naman🥹🥹 {type}" : msg = data.customLeave;
  msg = msg.replace(/\{name}/g, name).replace(/\{type}/g, type);

  var link = [  
"https://i.postimg.cc/T32xjS7n/26e7564bfb4408f9f7ff9518d4f87308.gif",
"https://i.postimg.cc/vHsbTD5q/9eff85aac8f21da39246ef40787864c8.gif",
"https://i.postimg.cc/8PmD6DH1/b4b1640525ecadfa1030e6096f3ec842.gif",
"https://i.postimg.cc/vHsbTD5q/9eff85aac8f21da39246ef40787864c8.gif",
  ];
  var callback = () => api.sendMessage({ body: msg, attachment: fs.createReadStream(__dirname + "/cache/leiamnashO.jpg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/leiamnashO.jpg"));
    return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname + "/cache/leiamnashO.jpg")).on("close", () => callback());
  }