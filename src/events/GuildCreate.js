const { Guild } = require('discord.js');
const SGClient = require('../structures/SGClient');

module.exports.info = {
    name: "guildCreate",
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
    guild.invites.fetch().then(guildInvites => {
        // This is the same as the ready event
        Bot.invites.set(guild.id, new Map(guildInvites.map((invite) => [invite.code, invite.uses])));
    })
}