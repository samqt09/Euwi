const fs = require("fs");
module.exports.config = {
	name: "tulog",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "VanHung - Fixed by LTD", 
	description: "hihihihi",
	commandCategory: "no prefix",
	usages: "zs",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("tulog kana fuji")==0 || event.body.indexOf("Tulog kana fuji")==0 || event.body.indexOf("matulog kana fuji")==0 || event.body.indexOf("Matulog kana fuji")==0) {
		var msg = {
				body: "ayaw🙁",
				attachment: fs.createReadStream(__dirname + `/noprefix/000.mp3`)
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🙁", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }