const { Message, GuildMember, User, MessageReaction } = require('discord.js');
const SGClient = require('../structures/SGClient');
const config = require('../config.json');

module.exports.info = {
    name: "messageReactionRemove",
    enabled: true
}
// This file is triggered only when new members join a server where the bot is in.
/**
 * 
 * @param {SGClient} Bot 
 * @param {MessageReaction} reaction
 * @param {User} user
 * @returns 
 */
module.exports.run = async (Bot, reaction, user) => {

    if(user.bot) return; // check if bot is a bot, if it is, do nothing.

    // get all the self roles from the server:
    let selfroles = await Bot.srManager.getSelfRoles(reaction.message.guild.id);
    // find all the self roles by the emoji id:
    let foundselfroles = selfroles.filter(a => a.emojiId == reaction.emoji.id);
    // loop through all the found self roles:
    foundselfroles.forEach(selfrole => {
        // check if message id corresponds with the reaction's message id.
        if(selfrole.messageId != reaction.message.id) return;
        // get the role by the role id:
        let role = reaction.message.guild.roles.cache.get(selfrole.roleId);
        // check if role exists, if not, do nothing.
        if(!role) return;
        // get the member by the user id:
        let m = reaction.message.guild.members.cache.get(user.id);
        // if user is not found, do nothing.
        if(!m) return;
        // remove the role to member, if there's an error, catch it, and do nothing with it.
        m.roles.remove(role).catch(() => {});
        
    })

}