const fs = require("fs");
module.exports.config = {
	name: "kol",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "VanHung - Fixed by LTD", 
	description: "hihihihi",
	commandCategory: "no prefix",
	usages: "uwu",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("kol")==0 || event.body.indexOf("Kol")==0 || event.body.indexOf("bata")==0 || event.body.indexOf("Bata")==0) {
		var msg = {
				body: "ayaw kol bata pako kol~",
				attachment: fs.createReadStream(__dirname + `/noprefix/kol.mp3`)
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("😖", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }