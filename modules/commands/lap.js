const request = require("request");
const fs = require("fs")
const axios = require("axios");
module.exports.config = {
  name: "laplap",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "John Arida",
  description: "Kick Someone You Want",
  commandCategory: "Others",
  usages: "{tag}",
  cooldowns: 5,
};

module.exports.run = async ({
  api,
  event,
  args,
  client,
  Users,
  Threads,
  __GLOBAL,
  Currencies
}) => {
  const request = require("request");

  const fs = require("fs");

  var mention = Object.keys(event.mentions)[0];

  let tag = event.mentions[mention].replace("@", "");

  var link = ["https://i.imgur.com/8DJd9PP.gif"];

  var callback = () =>
    api.sendMessage(
      {
        body: `${tag} , ugh!`,
        mentions: [
          {
            tag: tag,

            id: Object.keys(event.mentions)[0]
          }
        ],

        attachment: fs.createReadStream(__dirname + "/cache/da.jpg")
      },
      event.threadID,
      () => fs.unlinkSync(__dirname + "/cache/da.jpg")
    );

  return request(encodeURI(link[Math.floor(Math.random() * link.length)]))
    .pipe(fs.createWriteStream(__dirname + "/cache/da.jpg"))
    .on("close", () => callback());
};
