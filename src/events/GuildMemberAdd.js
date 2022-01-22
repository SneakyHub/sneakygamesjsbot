const { Message, GuildMember } = require('discord.js');
const { readFileSync } = require('fs');
const SGClient = require('../structures/SGClient');
const config = require('../config.json');

module.exports.info = {
    name: "guildMemberAdd",
    enabled: true
}
// This file is triggered only when new members join a server where the bot is in.
/**
 * 
 * @param {SGClient} Bot 
 * @param {GuildMember} member
 * @returns 
 */
module.exports.run = async (Bot, member) => {

    if(member.user.bot) return;
    
    member.guild.invites.fetch().then(newInvites => {
        // This is the *existing* invites for the guild.
        const oldInvites = Bot.invites.get(member.guild.id);
        // Look through the invites, find the one for which the uses went up.
        const invite = newInvites.find(i => i.uses > oldInvites.get(i.code));
        // This is just to simplify the message being sent below (inviter doesn't have a tag property)
        const inviter = Bot.users.cache.get(invite.inviter.id);
        // Get the log channel (change to your liking)
        const logChannel = member.guild.channels.cache.find(channel => channel.id == config.channels.welcome);
        if(!logChannel) return;
        // A real basic message with the information we need.
        logChannel.send(`Hey, ${member.user}! Thank you for taking interest in our project! You have been invited by: ${inviter.tag} which they now have **${invite.uses}** uses.\nYou are member #${member.guild.memberCount}!\nPlease head over to https://dash.sneakyhub.com/ to get started! Be sure to check out our new <#919360196999012382> channel!`)
    });
}