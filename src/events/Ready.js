const { readFileSync } = require("fs");
const SGClient = require("../structures/SGClient");

module.exports.info = {
    name: "ready",
    enabled: true
}
// This file checks if every message is a valid command, if it is, it triggers the command.
/**
 * 
 * @param {SGClient} Bot 
 */
module.exports.run = async (Bot) => {
    console.info("Info │ Bot ready, Logged in as", Bot.user.tag); // send in console that the bot is ready.
    Bot.user.setActivity('over SneakyGames', { type: 'WATCHING' }); // set the activity to "Watching over SneakyGames"

    await Bot.wait(1000);
    Bot.guilds.cache.forEach(async (guild) => {
        // Fetch all Guild Invites
        const firstInvites = await guild.invites.fetch();
        // Set the key as Guild ID, and create a map which has the invite code, and the number of uses
        Bot.invites.set(guild.id, new Map(firstInvites.map((invite) => [invite.code, invite.uses])));
    });
}