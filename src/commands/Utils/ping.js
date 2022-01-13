const config = require('../../config.json')
const Discord = require('discord.js') 

module.exports.info = {
    name: "ping",
    description: "Check bot's latency",
    category: "Utils",
    aliases: ["latency", "lat"],
}

module.exports.run = async (Bot, message) => {
    let Loading = new Discord.MessageEmbed() // create embed.
    .setTitle('Pinging websocket') // set title
    .setDescription('Please wait...')  // set description
     // set author
    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({
        dynamic: true,
        format: 'png'
    })})
    .setColor(config.colors.info) // set color

    let Reply = await message.reply({embeds: [Loading]}); // reply with the embed and save it to variable to use it later...

    await(Bot.ws.ping); // idk what's this so ill let it here.

    let Success = new Discord.MessageEmbed() // create another embed.
    .setTitle('Pong!') // set title.
    // set author
    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({
        dynamic: true,
        format: 'png'
    })})
    // set description
    .setDescription(`**Websocket heartbeat**: ${Bot.ws.ping}ms\n**Latency**: ${Reply.createdTimestamp - message.createdTimestamp}ms`)
    .setColor(config.colors.success) // set color

    Reply.edit({embeds: [Success]}) // reply with embed.
}