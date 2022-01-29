const SGClient = require("./SGClient");
const uuid = require('uuid').v4;

module.exports = class ReminderManager {

    /**
     * @param {SGClient} client 
     */
    constructor(client) {
        this.client = client; // initialize client property.
        this.loadReminders();
    }

    async loadReminders() { // function where all the reminders are being loaded.
        // check if there's no collection with 'reminders', if not, create it.
        if(!(await this.client.db.get('reminders'))) await this.client.db.set('reminders', {}, -1);
        
        let users = await this.getUsers(); // get the users
        for(let userId in users) { // loop through all the users
            users[userId].forEach(reminder => { // loop through all the reminders of the user
                this.loadReminder(reminder, userId); // load the reminder
            })
        }
    }

    loadReminder(reminder, userId) { // function where the reminder with id is being loaded.
        let int = setInterval(() => { // loop every 1 second.

            let currentTime = Math.floor(new Date().getTime()/1000); // get current time.

            if(currentTime >= reminder.remindAt) { // check if current time is more than the remind time.
                clearInterval(int); // clear the loop.
                this.deleteReminder(reminder.id); // delete the reminder
                let user = this.client.users.cache.get(userId); // find user by their id.
                if(!user) return; // check if there's no user.
                let channel = this.client.channels.cache.get(reminder.channelId); // get the channel by the id.
                if(!channel) return; // check if there's no channel.
                channel.send({ // send an embed
                    content: `<@${user.id}>`, // mention the user.
                    embeds: [ // set up the embeds
                        {
                            title: `You got reminded for **${reminder.title}**.`, // title of the first embed,
                            timestamp: new Date(Math.floor(reminder.createdAt*1000)), // timestamp
                            color: 'AQUA' // color
                        },
                    ]
                });
            }

        }, 1000);
    }

    /** JSON */
    // getUsers() {
    //     return JSON.parse(readFileSync('./src/reminders.json', 'utf8'));
    // }

    /** MONGODB */
    async getUsers() { // get all the users' reminders.
        return await this.client.db.get('reminders');
    }

    /** MONGODB */
    async existsUser(userId) { // check if the user exists in database.
        return (await this.getUsers())[userId] != undefined;
    }

    /** MONGODB */
    async createUser(userId) { // create user by id.
        await this.saveUser(userId, []);
    }

    /** JSON */
    // getUser(userId) {
    //     return this.getUsers()[userId] || [];
    // }

    /** MONGODB */
    async getUser(userId) { // get user by their id.
        return (await this.getUsers())[userId];
    }

    /** JSON */
    // saveUser(userId, newData) {
    //     let users = this.getUsers();
    //     users[userId] = newData;
    //     writeFileSync('./src/reminders.json', JSON.stringify(users,null,4));
    // }

    /** MONGODB */
    async saveUser(userId, newData) { // save user with the new data.
        let users = await this.getUsers(); // get users.
        users[userId] = newData; // set the new data.
        await this.client.db.set('reminders', users, -1); // set the new data in database.
    }

    /** MONGODB */
    async deleteReminder(reminderId) { // delete an reminder by it's id.
        let users = await this.getUsers(); // get users.
        for(let userId in users) { // loop through all the users.
            users[userId] = users[userId].filter(a => a.id != reminderId); // set the new reminders (it's gonna remove only the one with the id.).
        }
        await this.client.db.set('reminders', users, -1); // set the new data in database.
    }

    getReminderTemplate() { // a simple reminder template.
        return {
            id: uuid(),
            remindAt: null,
            title: '',
            createdAt: null,
            channelId: ''
        }
    }

}