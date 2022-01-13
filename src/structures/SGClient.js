const { Client, LimitedCollection, Intents } = require("discord.js");
const { readdir } = require("fs");

module.exports = class SGClient extends Client {

    constructor() {
        super({intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_MESSAGES
        ]});
        this.prefix = 'sg!';
        this.owners = ['746113176885657701'];
        this.commands = new LimitedCollection();
        this.aliases = new LimitedCollection();
        this.events = new LimitedCollection();
    }

    start(token) {

        readdir("./src/utils/", (err, files) => {

            if (err) console.error(err);
            let jsfiles = files.filter(f => f.split(".").pop() === "js"); 
            
            if (jsfiles.length <= 0) return console.warn("Warn │ No utilities have been found");
        
            console.info(`Info │ Loading ${jsfiles.length} utilities...`);
            jsfiles.forEach((f, i) => {
                let props = require('../utils/'+f);
                if(props.info.enabled === false) return;
                props.run(this)
            });
        });

        this.login(token);

    }

}