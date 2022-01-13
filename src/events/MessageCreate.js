const { Message } = require('discord.js');
const config = require('../config.json');
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
    if (message.author.bot || message.channel.type === 'DM' || !message.content.toLowerCase().startsWith(Bot.prefix)) return; 
  
    let args = message.content.slice(Bot.prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    let command = Bot.commands.get(cmd) || Bot.aliases.get(cmd);
    
    if(!command) return;

    try {
      command.run(Bot, message, args)
    } catch (err) {
      console.error(err);
    }
}