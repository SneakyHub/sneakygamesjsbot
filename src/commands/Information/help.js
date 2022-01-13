const config = require('../../config.json')
const Discord = require('discord.js') 
const SGClient = require('../../structures/SGClient')

module.exports.info = {
    name: "help",
    description: "Get information about the bot and the commands.",
    category: "Information",
    aliases: ["h"]
}

/**
 * 
 * @param {SGClient} Bot 
 * @param {Discord.Message} message 
 * @param {string[]} args 
 */
module.exports.run = async (Bot, message, args) => {

    if(!args[0]) {

        let categories = {};
        for(let command of Bot.commands) {
            if(!categories[command[1].info.category]) {
                categories[command[1].info.category] = [];
            }
            categories[command[1].info.category].push(command[0]);
        }
        console.log(categories);

        let helpEmb = new Discord.MessageEmbed()
            .setTitle('SneakyGames | Help')
            .setDescription(`Sneaky Development was made by contributors from the [github repository](https://github.com/SneakyHub/sneakygamesjsbot).\nBot Prefix: \`${Bot.prefix}\`\nUse \`${Bot.prefix}help <command>\` to search information about the specified command.`)
            .setColor(config.colors.success)
            .setTimestamp()
            .setThumbnail(Bot.user.displayAvatarURL({format: 'png'}))
            .setFooter({
                text: message.author.tag,
                iconURL: message.author.displayAvatarURL({
                    dynamic: true,
                    format: 'png'
                })
            });
        for(let category in categories){
            console.log(category);
            helpEmb.addField(category, `\`\`\`${categories[category].join(', ')}\`\`\``)
        }
        message.reply({
            embeds: [helpEmb]
        });
        return;

    }

    let cmd = args[0].toLowerCase();
    let cmdFirstLetterUppercase = args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase();
    let command = Bot.commands.get(cmd) || Bot.aliases.get(cmd);
    if(!command) return message.reply(`There's no commands by the name of \`${cmd.toLowerCase()}\``)

    let cmdEmb = new Discord.MessageEmbed()
        .setTitle('SneakyGames | ' + cmdFirstLetterUppercase + '\'s Information')
        .setColor(config.colors.success)
        .setTimestamp()
        .setThumbnail(Bot.user.displayAvatarURL({format: 'png'}))
        .setFooter({
            text: message.author.tag,
            iconURL: message.author.displayAvatarURL({
                dynamic: true,
                format: 'png'
            })
        })
        .addField(`Description`, command.info.description)
        .addField(`Category`, command.info.category)
        .addField(`Aliases`, command.info.aliases.length == 0 ? 'No Aliases' : command.info.aliases.join(', '))
    
        message.reply({
        embeds: [cmdEmb]
    })

}