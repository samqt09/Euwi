const fs = require("fs");
module.exports.config = {
	name: "no",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "VanHung - Fixed by LTD", 
	description: "hihihihi",
	commandCategory: "no prefix",
	usages: "no",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("Kick")==0 || event.body.indexOf("kick")==0 || event.body.indexOf("alis")==0 || event.body.indexOf("Alis")==0) {
		var msg = {
				body: "😦",
				attachment: fs.createReadStream(__dirname + `/noprefix/no.mp3`)
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🙁", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }