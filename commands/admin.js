
const Discord = require("discord.js");
const c = require("control-panel-api-wrapper");

const cp = new c("https://dash.fivempanel.net/", "B8uD3ghGnv7RgnxeeIxzj1CdfVecU3xEWydH_imIvVfgXhyp");

const talkedRecently = new Set();

var request = require('request');

const {dashboardurl, dashboardtoken} = require("../config.json")

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

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

var GetUser2 = function(discordID) {
    return new Promise( ( resolve, reject ) => {
      GetUser().then(function(val) {
        for (let i = 0; i < JSON.parse(val).data.length; i++) {
          if (JSON.parse(val).data[i]['discord_user']) {
            if (JSON.parse(val).data[i]['discord_user']['id'] === discordID) {
              resolve(JSON.parse(val).data[i]['email']);
            }
          }
        }
      }).catch(function(err) {
          console.log(err);
      });
    } );
  }
  

function createVoucher(code, uses, credits) {
        const options = {
            uri: dashboardurl + '/api/vouchers',
            method: 'POST',
            headers: {
            'User-Agent': 'YourHostBackend',
            'Authorization': 'Bearer ' + dashboardtoken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            },
            form: {
              'code': ''+code,
              'uses': ''+uses,
              'credits': ''+credits,
              }
        };
  
        request(options, function (error, response, body) {
        });
  }

module.exports.run = async (bot, message, args) => {
  if (message.member.permissions.has("ADMINISTRATOR")) {
    if (args[0] === 'drop') {
      if (args[1]) {
        if (args[2]) {
          var code = makeid(24)
          createVoucher(code, args[1], args[2]);
          message.reply("New Code genereted: " + code);
        }
        else {
          message.reply("You have to write credits amount");
        }
      } else {
        message.reply("You have to write uses amount");
      }
    }
  } else {
    message.reply("You are not a admin");
  }
}



module.exports.help = {
  name:"admin",
}