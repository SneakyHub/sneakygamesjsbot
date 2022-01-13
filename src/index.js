const Discord = require('Discord.js')
const config = require('./config.json')
const Bot = new Discord.Client({intents: config.intents});
const fs = require('fs');

Bot.on('ready', async () => {
    console.info("Info │ Bot ready")
    Bot.user.setActivity('over SneakyGames', { type: 'WATCHING' })
})

// Utilities will manage loading events and commands.
fs.readdir("./utils/", (err, files) => {

  if (err) console.error(err);
  let jsfiles = files.filter(f => f.split(".").pop() === "js"); 
  
  if (jsfiles.length <= 0) return console.warn("Warn │ No utilities have been found");

  console.info(`Info │ Loading ${jsfiles.length} utilities...`);
  jsfiles.forEach((f, i) => {
    let props = require(`./utils/${f}`);
    if(props.info.enabled === false) return;
    props.run(Bot)
  });
});


Bot.login(config.token)
