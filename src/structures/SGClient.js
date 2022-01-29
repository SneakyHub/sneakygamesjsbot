const { Client, LimitedCollection, Intents } = require("discord.js");
const { readdir } = require("fs");
const ReminderManager = require("./ReminderManager");
const { Database } = require("quickmongo");
const SelfRolesManager = require("./SelfRolesManager");

module.exports = class SGClient extends Client { // create the base class.

    constructor() { // create the constructor
        super({intents: [ // set the intents.
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS
        ]});
        this.wait = require("timers/promises").setTimeout;
        this.prefix = 'sg!'; // set the prefix
        this.owners = ['746113176885657701']; // set the owners (Sneaky)
        this.commands = new LimitedCollection(); // create 'commands' collection.
        this.aliases = new LimitedCollection(); // create 'aliases' collection.
        this.events = new LimitedCollection(); // create 'events' collection.
        this.invites = new Map(); // create 'invites' map.


        this.db = new Database(process.env.MONGODB_URL); // initialize the database.
        this.db.on('ready', async () => { // 'ready' event.
            console.log('Info | Connnected to Mongo Database.');
            await this.db.delete('selfroles');

            this.reminderManager = new ReminderManager(this); // initialize Reminder Manager.
            this.srManager = new SelfRolesManager(this); // initialize SelfRoles Manager.

        });
        // connect to database:
        this.db.connect();
        
    }

    start(token) { // create 'start' function

        readdir("./src/utils/", (err, files) => { // get all the files from './src/utils/' folder.

            if (err) console.error(err); // check if it has error and print it out.
            let jsfiles = files.filter(f => f.split(".").pop() === "js"); // get the files that have 'js' at the end of the name. 
            
            if (jsfiles.length <= 0) return console.warn("Warn │ No utilities have been found"); // if there's no files, warn the user.
        
            console.info(`Info │ Loading ${jsfiles.length} utilities...`);
            jsfiles.forEach((f, i) => { // looping through all the files...
                let props = require('../utils/'+f); // get the base functions.
                if(props.info.enabled === false) return; // check if it's enabled.
                props.run(this) // run the function.
            });
        });

        this.login(token); // log in to the bot.

    }

}