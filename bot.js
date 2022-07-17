const Discord = require("discord.js")
const { Client, Intents } = require('discord.js');

const {prefix, token} = require("./config.json")
const fs = require("fs");

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


bot.commands = new Discord.Collection();


fs.readdir("./commands/", (err, files) => {
  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });
});



bot.on("message", (message) => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return 

  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  
  if(!message.content.startsWith(prefix)) return;
let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args);
})

bot.on('message', async message => {
 
  var command = message.content.toLowerCase().slice(prefix.length).split(' ')[0];
 
  var args = message.content.split(' ').slice(1);
 
  if (message.author.bot) return;
  

 
})
bot.login(token);