const config = require('../../config.json')
const Discord = require('discord.js') 
const SGClient = require('../../structures/SGClient')

module.exports.info = {
    name: "selfroles",
    description: "Add/remove a self role.",
    category: "Utils",
    aliases: ["sr"],
}
/**
 * 
 * @param {SGClient} Bot 
 * @param {Discord.Message} message 
 * @param {string[]} args 
 * @returns 
 */
module.exports.run = async (Bot, message, args) => {

    // check if member can manage roles:
    if(!message.member.permissions.has('MANAGE_ROLES')) return message.reply('You cannot use this command because you can\'t manage roles!');

    // check if an argument is provided:
    if(!args[0]) return message.reply('Please provide an argument (add/remove/list).');

    // check if argument is:
    switch(args[0]){
        case 'add':
            // check if argument 1 is provided:
            if(!args[1]) return message.reply('Please provide a channel mention/id!');
            // check if argument 2 is provided:
            if(!args[2]) return message.reply('Please provide a message id!');
            // check if argument 3 is provided:
            if(!args[3]) return message.reply('Please provide a role mention/id!');
            // check if argument 4 is provided:
            if(!args[4]) return message.reply('Please provide an emoji!');

            // get the channel id/mention
            let channel = args[1];
            // get the message id
            let messageid = args[2];
            // get the role id/mention
            let role = args[3];
            // get the emoji
            let emoji = args[4];

            // find the channel by mention/id:
            let c = message.mentions.channels.first() || message.guild.channels.cache.get(channel);
            // check if channel doesn't exist:
            if(!c) return message.reply('Invalid channel!');
            // get the message by id:
            let m = c.messages.cache.get(messageid) || await c.messages.fetch(messageid);
            // check if message doesn't exist:
            if(!m) return message.reply('Invalid Message Id!');
            // get the role by id/mention:
            let r = message.mentions.roles.first() || message.guild.roles.cache.get(role);
            // check if role doesn't exist:
            if(!r) return message.reply('Invalid Role!');
            // get the emoji from server, or default:
            let e = (Bot.emojis.cache.get(emoji) ? Bot.emojis.cache.get(emoji).name : Bot.emojis.cache.get(emoji)) || emoji;

            // get the self role template:
            let template = Bot.srManager.getSelfRoleTemplate();
            
            // set all the values:
            template.channelId = c.id;
            template.messageId = m.id;
            template.guildId = message.guild.id;
            template.roleId = r.id;
            template.emoji = e;

            // react to message with the emoji:
            await m.react(e);
            // save the template:
            await Bot.srManager.saveSelfRole(template);

            // reply with a message:
            message.reply('Successfully created self role.');

            break;
        case 'remove':

            // check if argument 1 is provided:
            if(!args[1]) return message.reply('Please provide self role uuid! (You can find it in `'+Bot.prefix+'selfroles list`)');

            // find all the self roles by provided uuid:
            let foundselfroles = await Bot.srManager.getSelfRolesByUuid(args[1].toLowerCase());
            // check if no self roles are found:
            if(!foundselfroles.length) return message.reply('No self roles found by that uuid!');

            // loop through all the found self roles:
            foundselfroles.forEach(async sr => {
                // get the channel by the id:
                let c = message.guild.channels.cache.get(sr.channelId);
                // check if channel doesn't exist, if not, return;
                if(!c) return;
                // get the message by the id:
                let m = c.messages.cache.get(sr.messageId);
                // check if message doesn't exist, if not, return;
                if(!m) return;
                // get the reaction by the emoji id:
                let r = m.reactions.resolve(sr.emoji);
                // check if reaction doesn't exist, if not, return;
                if(!r) return;
                // remove the reaction from message.
                await r.remove();
            })
            // get the data from database:
            let newData = await Bot.srManager.getData();
            // set the new data:
            newData = newData.filter(a => !foundselfroles.map(a => a.id).includes(a.id));
            // save the new data:
            await Bot.srManager.saveData(newData);
            // reply with a message.a
            message.reply('Successfully deleted all self roles with that uuid!');

            break;
        case 'list':
            // get all the self roles from the server:
            let selfroles = await Bot.srManager.getSelfRoles(message.guild.id);
            // check if the user doesn't have any selfroles.
            if(!selfroles.length) return message.reply('This server has no self roles!');
            // create embed:
            let em = new Discord.MessageEmbed()
                .setColor('AQUA') // color
                .setTitle(`${message.guild.name}'s Self Roles`) // title of embed,
                .setTimestamp() // timestamp
                .setFooter({ // footer
                    text: `Executed by: ${message.author.tag}`, // footer text.
                    iconURL: message.author.displayAvatarURL({ // footer icon url
                        dynamic: true, // make it able to be animated.
                        format: 'png' // default format to png.
                    })
                })
            selfroles.forEach(selfrole => { // loop through all the selfroles.
                // add a field to the embed.
                em.addField(selfrole.id, [
                    `**Channel**: ${message.guild.channels.cache.get(selfrole.channelId)} (${selfrole.channelId})`,
                    `**Message Id**: ${selfrole.messageId}`,
                    `**Role**: ${message.guild.roles.cache.get(selfrole.roleId).name} (${selfrole.roleId})`,
                    `**Emoji**: ${message.guild.emojis.cache.find(a => a.name === selfrole.emoji) || Bot.emojis.cache.find(a => a.name === selfrole.emoji) || `${selfrole.emoji}`}`
                ].join('\n'));
            })
            message.reply({ // reply with the embed.
                embeds: [em]
            })
            break;
    }

}