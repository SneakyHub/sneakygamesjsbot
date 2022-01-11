const config = require('../config.json')

module.exports.info = {
    name: "messageCreate",
    enabled: true
}
// This file checks if every message is a valid command, if it is, it triggers the command.
module.exports.run = async (Bot, message) => {
    if (message.author.Bot) return; 

    let messageArray = message.content.split(" ");
    let command = messageArray[0].toLowerCase(); 
    let args = messageArray.slice(1);
  
    var hasPrefix = false
    config.prefixes.forEach(prefix =>{
      if(command.startsWith(prefix)) return hasPrefix = prefix; // Support multiple prefixes
    })
  
    if(!hasPrefix) return console.warn(message.content);
  
    let cmd = Bot.commands.get(command.slice(hasPrefix.length)) || Bot.aliases.get(command.slice(hasPrefix.length)); // Find command using command name or alias
  
    if (cmd) cmd.run(Bot, message, args)
}