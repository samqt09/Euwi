const fs = require("fs");
module.exports.config = {
	name: "night1",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "VanHung - Fixed by LTD", 
	description: "hihihihi",
	commandCategory: "no prefix",
	usages: "night",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("good night")==0 || event.body.indexOf("Good night")==0 || event.body.indexOf("Matutulog")==0 || event.body.indexOf("matutulog")==0) {
		var msg = {
				body: "goodnight mwah",
				attachment: fs.createReadStream(__dirname + `/noprefix/night.mp3`)
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("😴", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }