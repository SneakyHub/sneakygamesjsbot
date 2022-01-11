const Discord = require('discord.js')
const fs = require('fs')

module.exports.info = {
    enabled: true
}

module.exports.run = Bot => {

fs.readdir("./commands/", (err, files) => {
    Bot.commands = new Discord.Collection();
    Bot.aliases = new Discord.Collection();

    if (err) console.error(err);
    let jsfiles = files.filter(f => f.split(".").pop() === "js"); 
    
    if (jsfiles.length <= 0) return console.warn("Warn │ No commands have been found");
  
    console.info(`Info │ Loading ${jsfiles.length} command(s)...`);
    jsfiles.forEach((f, i) => {
      let props = require(`../commands/${f}`);
      Bot.commands.set(props.info.name, props);       // ← Register command
      props.info.aliases.forEach(alias =>{
       Bot.aliases.set(alias, props.info.name) // ← Register aliases
      })
    });
  });
}