const { Guild } = require('discord.js');
const SGClient = require('../structures/SGClient');

module.exports.info = {
    name: "guildDelete",
    enabled: true
}
// This file is triggered only when new members join a server where the bot is in.
/**
 * 
 * @param {SGClient} Bot 
 * @param {Guild} invite
 * @returns 
 */
module.exports.run = async (Bot, guild) => {
    Bot.invites.delete(guild.id);
}