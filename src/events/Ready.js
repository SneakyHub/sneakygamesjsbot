module.exports.info = {
    name: "ready",
    enabled: true
}
// This file checks if every message is a valid command, if it is, it triggers the command.
module.exports.run = async (Bot) => {
    console.info("Info │ Bot ready");
    Bot.user.setActivity('over SneakyGames', { type: 'WATCHING' });
}