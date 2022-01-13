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

    if(!args[0]) { // check if user didn't inserted an argument

        let categories = {}; // create a 'categories' variable.
        for(let command of Bot.commands) { // loop through all the commands
            if(!categories[command[1].info.category]) { // check if the command's category already is in 'categories' variable.
                categories[command[1].info.category] = []; // set it.
            }
            categories[command[1].info.category].push(command[0]); // push the command name to command's category.
        }

        // create a embed variable named 'helpEmb'.
        let helpEmb = new Discord.MessageEmbed()
            .setTitle('SneakyGames | Help') // set the title.
            .setDescription(`Sneaky Development was made by contributors from the [github repository](https://github.com/SneakyHub/sneakygamesjsbot).\nBot Prefix: \`${Bot.prefix}\`\nUse \`${Bot.prefix}help <command>\` to search information about the specified command.`) // set the description
            .setColor(config.colors.success) // set the color of embed.
            .setTimestamp() // set the timestamp.
            .setThumbnail(Bot.user.displayAvatarURL({format: 'png'})) // set thumbnail
            .setFooter({ // set footer
                text: message.author.tag, // set text of footer.
                iconURL: message.author.displayAvatarURL({ // set icon url of footer.
                    dynamic: true,
                    format: 'png'
                })
            });
        for(let category in categories){ // loop through all the categories.
            helpEmb.addField(category, `\`\`\`${categories[category].join(', ')}\`\`\``); // add a field with the corresponding category.
        }
        message.reply({ // reply with the help menu
            embeds: [helpEmb]
        });
        return; // return so it doesn't go any further

    }

    let cmd = args[0].toLowerCase(); // get the command name
    let cmdFirstLetterUppercase = args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase(); // get the command name with the first letter uppercase and other lowercase
    let command = Bot.commands.get(cmd) || Bot.aliases.get(cmd); // find the command by the name
    //check if command doesn't exist
    if(!command) return message.reply(`There's no commands by the name of \`${cmd.toLowerCase()}\``) 

    // create an embed with 'cmdEmb' variable.
    let cmdEmb = new Discord.MessageEmbed()
        .setTitle('SneakyGames | ' + cmdFirstLetterUppercase + '\'s Information') // set the title
        .setColor(config.colors.success) // set the color
        .setTimestamp() // set the timestamp
        .setThumbnail(Bot.user.displayAvatarURL({format: 'png'})) // set the thumbnail for embed.
        .setFooter({ // set the footer
            text: message.author.tag, // set the text of footer
            iconURL: message.author.displayAvatarURL({ // set the icon url of footer.
                dynamic: true,
                format: 'png'
            })
        })
        .addField(`Description`, command.info.description) // set the description of command in embed.
        .addField(`Category`, command.info.category) // set the category of command in embed.
        .addField(`Aliases`, command.info.aliases.length == 0 ? 'No Aliases' : command.info.aliases.join(', ')) // set the aliases of command in embed.
    
        message.reply({ // reply with the created embed.
            embeds: [cmdEmb]
        })

}