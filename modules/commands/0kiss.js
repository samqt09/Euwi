const fs = require("fs");
module.exports.config = {
	name: "zkiss",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "VanHung - Fixed by LTD", 
	description: "hihihihi",
	commandCategory: "no prefix",
	usages: "zkiss",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("kiss moko")==0 || event.body.indexOf("Kiss moko")==0 || event.body.indexOf("sana makiss")==0 || event.body.indexOf("Sana makiss")==0) {
		var msg = {
				body: "😘",
				attachment: fs.createReadStream(__dirname + `/noprefix/kiss.mp3`)
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("😘", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }