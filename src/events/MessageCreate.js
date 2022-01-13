const { Message } = require('discord.js');
const SGClient = require('../structures/SGClient');

module.exports.info = {
    name: "messageCreate",
    enabled: true
}
// This file checks if every message is a valid command, if it is, it triggers the command.
/**
 * 
 * @param {SGClient} Bot 
 * @param {Message} message 
 * @returns 
 */
module.exports.run = async (Bot, message) => {
    // check if user is bot, channel is a dm, and if message doesnt start with the prefix:
    if (message.author.bot || message.channel.type === 'DM' || !message.content.toLowerCase().startsWith(Bot.prefix)) return; 
  
    // get the arguments.
    let args = message.content.slice(Bot.prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase(); // get the command name.
    let command = Bot.commands.get(cmd) || Bot.aliases.get(cmd); // find command by the name.
    if(!command) return; // check if no commands arefound.

    try { // run the code in a try-catch block.
      command.run(Bot, message, args); // run the command.
    } catch (err) { // catch any errors.
      console.error(err); // print it out.
    }
}