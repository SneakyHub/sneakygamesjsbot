const config = require('../../config.json')
const Discord = require('discord.js'); 
const SGClient = require('../../structures/SGClient');
const ms = require('ms');
const moment = require('moment');
require('moment-duration-format');

module.exports.info = {
    name: "reminder",
    description: "Add/remove/list reminders.",
    category: "Reminders",
    aliases: []
}

/**
 * 
 * @param {SGClient} Bot 
 * @param {Discord.Message} message 
 * @param {string[]} args 
 * @returns 
 */
module.exports.run = async (Bot, message, args) => {

    // check if argument 1 isn't provided:
    if(!args[0]) return message.reply('Please provide an argument! (add/remove/list)');

    if(args[0] === 'add') { // add an reminder
        let when = args[1]; // get the timer
        // check if there's no arguments.
        if(!when) return message.reply('Please provide when you want to be reminded. (e.g 12d, 1w, 1month, 10s, 10m)');
        
        let title = 'No Title'; // initialize the title variable.
        // check if there's second argument:
        if(args[2]) title = args.join(' ').slice(args[0].length + 1 + args[1].length + 1);

        // get reminder template:
        let reminderTemplate = Bot.reminderManager.getReminderTemplate();

        // set the remindAt, title, createdAt and channelId.
        reminderTemplate.remindAt = Math.floor(((new Date().getTime())/1000) + Math.floor(ms(when)/1000));
        reminderTemplate.title = title;
        reminderTemplate.createdAt = Math.floor(new Date().getTime()/1000);
        reminderTemplate.channelId = message.channel.id;

        // check if user exists, if not, create user.
        if(!(await Bot.reminderManager.existsUser(message.author.id)))
            await Bot.reminderManager.createUser(message.author.id);
        
        // get user data.
        let data = await Bot.reminderManager.getUser(message.author.id);
        // add the reminder in user's reminders.
        data.push(reminderTemplate);

        // save user data.
        await Bot.reminderManager.saveUser(message.author.id, data);
        // load the reminder:
        Bot.reminderManager.loadReminder(reminderTemplate, message.author.id);
        // reply with a message to user.
        message.reply(`You successfully created a reminder with title **${title}**.\nYou will be reminded in **${moment.duration(ms(when)).format('y [years], M [months], w [weeks], d [days], h [hours], m [minutes], s [seconds]')}**.`);
    } else if( args[0] == 'remove' ) { // remove a reminder.
        // check if there's an argument.
        if(!args[1]) return message.reply(`Please provide a reminder id! (Use \`${Bot.prefix}reminder list\` for ids.)`);
        // check if user exists in database / has reminders, if not, send a message with "You have no reminders.".
        if(!(await Bot.reminderManager.existsUser(message.author.id))) return message.reply('You have no reminders.');
        // get all the user's reminders.
        let reminders = await Bot.reminderManager.getUser(message.author.id);
        // get the reminder by the provided id:
        let reminder = reminders.find(a => a.id === args[1].toLowerCase());
        // if there's no reminder, reply.
        if(!reminder) return message.reply('There\'s no reminder by that id!');
        // delete the reminder:
        await Bot.reminderManager.deleteReminder(args[1].toLowerCase());
        // reply to user with a message.
        message.reply('Successfully deleted reminder with id: ' + args[1].toLowerCase());
    } else if ( args[0] == 'list' ) { // list all the user's reminders.
        // check if user doesn't exists.
        if(!(await Bot.reminderManager.existsUser(message.author.id))) return message.reply('You have no reminders.');
        // get all the user's reminders:
        let reminders = await Bot.reminderManager.getUser(message.author.id);
        // check if the user doesn't have any reminders.
        if(!reminders.length) return message.reply('You have no reminders.');
        // create embed:
        let em = new Discord.MessageEmbed()
            .setColor('AQUA') // color
            .setTitle('Your Reminders:') // title of embed,
            .setTimestamp() // timestamp
            .setFooter({ // footer
                text: `Executed by: ${message.author.tag}`, // footer text.
                iconURL: message.author.displayAvatarURL({ // footer icon url
                    dynamic: true, // make it able to be animated.
                    format: 'png' // default format to png.
                })
            })
        reminders.forEach(reminder => { // loop through all the reminders.
            // add a field to the embed.
            em.addField(reminder.title, `**ID**: ${reminder.id}\n**Remind** <t:${reminder.remindAt}:R>\n**Started** <t:${reminder.createdAt}:R>`);
        })
        message.reply({ // reply with the embed.
            embeds: [em]
        })
    }

}