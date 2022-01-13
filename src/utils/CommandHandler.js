const { fips } = require('crypto');
const Discord = require('discord.js')
const fs = require('fs')

module.exports.info = {
    enabled: true
}

module.exports.run = Bot => {

fs.readdir("./commands/", (err, folders) => {
    Bot.commands = new Discord.Collection();
    Bot.aliases = new Discord.Collection();

    if (err) console.error(err);
    

    folders.forEach((fo, i) => {
      fs.readdir(`./commands/${fo}`, (err, files) => {

        let jsfiles = files.filter(f => f.split(".").pop() === "js"); 
        if (jsfiles.length <= 0) return console.warn(`Warn │ No commands have been found in folder ${fo}`);
        console.info(`Info │ Loading ${jsfiles.length} command(s)...`);

        jsfiles.forEach((fi, i) => {
          let props = require(`../commands/${fo}/${fi}`);
          var data = {}

          data = props.info.name
          data.description = props.info.description || ''
          data.aliases = props.info.aliases || []
          data.category = props.info.category || 'none'

          Bot.commands.set(data, props);       // ← Register command


          props.info.aliases.forEach(alias =>{
            if(!Bot.aliases.get(alias)) Bot.aliases.set(alias, props.info.name) // ← Register aliases if they don't exist already
          })
        })
      })
    });
  });
}