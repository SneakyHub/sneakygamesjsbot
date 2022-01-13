const { fips } = require('crypto');
const Discord = require('discord.js')
const fs = require('fs')

module.exports.info = {
  enabled: true
}

module.exports.run = Bot => {

  fs.readdir("./src/commands/", (err, folders) => { // get all the folders.
    if (err) console.error(err); // check if any errors.


    folders.forEach((fo, i) => { // loop through all the folders
      fs.readdir(`./src/commands/${fo}`, (err, files) => { // get all the files from the folder.

        let jsfiles = files.filter(f => f.split(".").pop() === "js"); // get all the files.
        if (jsfiles.length <= 0) return console.warn(`Warn │ No commands have been found in folder ${fo}`);
        console.info(`Info │ Loading ${jsfiles.length} command(s)...`);

        jsfiles.forEach((fi, i) => { // loop  through the files.
          let props = require(`../commands/${fo}/${fi}`); // get the functions.
          var data = {} // create data variable

          data.description = props.info.description || '' // set the description or empty.
          data.aliases = props.info.aliases || [] // set the aliases or empty array.
          data.category = props.info.category || 'none' // set the category or none.

          Bot.commands.set(data, props);       // ← Register command


          if(props.info.aliases && Array.isArray(props.info.aliases)) { // check if there are aliases and if it's an array
            props.info.aliases.forEach(alias => { // loop through all the aliases
              if (!Bot.aliases.get(alias)) Bot.aliases.set(alias, props) // ← Register aliases if they don't exist already
            })
          }
        })
      })
    });
  });
}