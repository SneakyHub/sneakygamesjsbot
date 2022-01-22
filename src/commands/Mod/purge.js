const config = require('../../config.json')
const Discord = require('discord.js'); 
const SGClient = require('../../structures/SGClient');

module.exports.info = {
    name: "purge",
    description: "Purge an amount of messages in the current channel.",
    category: "mod",
    aliases: ["clear", "delete"],
}

/**
 * 
 * @param {SGClient} Bot 
 * @param {Discord.Message} message 
 * @param {string[]} args 
 * @returns 
 */
module.exports.run = async (Bot, message, args) => {

    let amount = args[0];
    if(!amount) return message.reply('Please provide an amount of messages!');
    if(isNaN(amount)) return message.reply('Must be a number!');
    if(amount < 1 || amount > 100) return message.reply('Must be a number between 1-100');

    if(message.deletable) message.delete();

    message.channel.messages.fetch().then(() => {
        message.channel.bulkDelete(amount).then(msgs => {
            message.channel.send(`Deleted an amount of **${msgs.size}** messages.`);
        })
    })

}