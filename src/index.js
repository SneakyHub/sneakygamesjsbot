const SGClient = require('./structures/SGClient');

require('dotenv').config(); // load .env file

new SGClient().start(process.env.token); // start the bot with the specified token.