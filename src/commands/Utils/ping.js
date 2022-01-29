const config = require('../../config.json')
const Discord = require('discord.js') 

module.exports.info = {
    name: "ping",
    description: "Tests the bot's latency",
    category: "Utils",
    aliases: ["latency", "lat"],
}

module.exports.run = async (Bot, message) => {
    let Loading = new Discord.MessageEmbed()
    .setTitle('Pinging websocket')
    .setDescription('Please wait...') 
    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL()})
    .setColor(config.colors.info)

    let Reply = await message.reply({embeds: [Loading]})

    await(Bot.ws.ping)

    let Success  = new Discord.MessageEmbed()
    .setTitle('Pong!')
    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL()})
    .setDescription(`**Websocket heartbeat**: ${Bot.ws.ping}ms\n**Latency**: ${Reply.createdTimestamp - message.createdTimestamp}ms`)
    .setColor(config.colors.success)

    Reply.edit({embeds: [Success]})
}