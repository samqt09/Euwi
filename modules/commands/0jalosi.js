const fs = require("fs");
module.exports.config = {
	name: "jalosi",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "VanHung - Fixed by LTD", 
	description: "hihihihi",
	commandCategory: "no prefix",
	usages: "jalosi",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("selos")==0 || event.body.indexOf("nag seselos")==0 || event.body.indexOf("Nag seselos")==0 || event.body.indexOf("Selos")==0) {
		var msg = {
				body: "jalosi:(",
				attachment: fs.createReadStream(__dirname + `/noprefix/jalosi.mp3`)
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🙁", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }