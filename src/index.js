const SGClient = require('./structures/SGClient');

require('dotenv').config();

new SGClient().start(process.env.token);