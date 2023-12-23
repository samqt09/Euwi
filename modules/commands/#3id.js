module.exports.config = {
  name: "uid2",
  version: "2.0.0",
  hasPermission: 0,
  credits: "Blue", // requested by bundas
  description: "User and group id in one file",
  commandCategory: "box",
  usages: "allid (mention user)",
  cooldowns: 5,
  dependencies: '',
};

module.exports.run = async function ({ api, event }) {
  const tid = event.threadID;
  const uid = event.senderID;
  const userName = (await api.getUserInfo(uid))[uid].name;

  if (!event.mentions || Object.keys(event.mentions).length === 0) {
    
    const message = `User Name: ${userName} User ID (uid): ${uid}`;
    return api.sendMessage(message, event.threadID);
  } else {
    
    const mentionedUsers = Object.keys(event.mentions).map((id) => ({
      id,
      name: event.mentions[id],
    }));

    const message = `\nUser Name: ${userName} User ID (uid): ${uid}`;
    
    const mentionedUsersInfo = mentionedUsers.map(
      (user) => `${user.name.replace('@', '')} (uid: ${user.id})`
    );

    return api.sendMessage(message + mentionedUsersInfo.join('\n'), event.threadID);
  }
};