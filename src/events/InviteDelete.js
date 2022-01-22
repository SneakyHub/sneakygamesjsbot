const { Message, GuildMember, Invite } = require('discord.js');
const { readFileSync, writeFileSync } = require('fs');
const SGClient = require('../structures/SGClient');

module.exports.info = {
    name: "inviteDelete",
    enabled: true
}
// This file is triggered only when new members join a server where the bot is in.
/**
 * 
 * @param {SGClient} Bot 
 * @param {Invite} invite
 * @returns 
 */
module.exports.run = async (Bot, invite) => {

    if(invite.inviter.bot) return;
    
    Bot.invites.get(invite.guild.id).delete(invite.code);

}