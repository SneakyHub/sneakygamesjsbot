const Discord = require("discord.js");

var request = require('request');

const {dashboardurl, dashboardtoken} = require("../config.json")

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

function GetUser(params, postData) {
  return new Promise(function(resolve, reject) {
      const options = {
          uri: dashboardurl + '/api/users?include=discordUser',
          method: 'GET',
          headers: {
          'User-Agent': 'YourHostBackend',
          'Authorization': 'Bearer ' + dashboardtoken,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          },
      };

      request(options, function (error, response, body) {
          if (response.statusCode !== 200) { reject(response.statusCode) }
          resolve(body)
      });
  });
}


// async function GetUser2(name) {
//   await GetUser().then(function(val) {
//     for (let i = 0; i < JSON.parse(val).data.length; i++) {
//       if (JSON.parse(val).data[i]['name'] === name) {
//         return(JSON.parse(val).data[i]['credits']);
//       }
//     }
//   }).catch(function(err) {
//       console.log(err);
//   });
//   return '1';
// }


var GetUser2 = function(discordID) {
  return new Promise( ( resolve, reject ) => {
    GetUser().then(function(val) {
      for (let i = 0; i < JSON.parse(val).data.length; i++) {
        if (JSON.parse(val).data[i]['discord_user']) {
          if (JSON.parse(val).data[i]['discord_user']['id'] === discordID) {
            resolve(JSON.parse(val).data[i]['credits']);
          }
        }
      }
    }).catch(function(err) {
      message.reply("You are not registered on our site");
    });
  } );
}



module.exports.run = async (bot, message, args) => {

  // var cashhave = await GetUser2(message.author.username);
  GetUser2(message.author['id'])
  .then( ( cashhave ) => {
    message.reply("You Have " + cashhave + "$");
  } )
  .catch( ( err ) => {
    console.error( 'Error!' );
  } );



}



module.exports.help = {
  name:"bal"
}