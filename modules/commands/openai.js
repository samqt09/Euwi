var cred = "\u0044\u0065\u006b\u0075";
module.exports.config = {
  name: "Openai",
  version: "1.0.0",
  hasPermssion: 0,
  credits: `${cred}`,
  description: "\u0054\u0061\u006c\u006b\u0020\u0074\u006f\u0020\u0041\u0049",
  usages: "\u005b\u0074\u0065\u0078\u0074\u005d",
  commandCategory: "\u0049\u006e\u0066\u006f",
  cooldowns: 60
};
module.exports.run = async function({api, event, args, utils, Users, Threads}) {
  const axios = require('axios');
  if ((this.config.credits) != `${cred}`) { return api.sendMessage(`ulol change credits pa `, event.threadID, event.messageID)}
  let text = args.join(" ");
  if (!text) return api.sendMessage("Hi I'm Ryy! ask me anything i can help you to all your subjects making essay for you and more..", event.threadID, event.messageID);
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);
const completion = await openai.createCompletion({
  model: "text-davinci-003",
    prompt: `${text}`,
    temperature: 1,
    max_tokens: 1240,
  });
 console.log(completion.data.choices[0].text);
  
api.sendMessage(`${completion.data.choices[0].text}`, event.threadID, event.messageID);
}