
const Discord = require("discord.js");
const c = require("control-panel-api-wrapper");

const cp = new c("https://dash.fivempanel.net/", "B8uD3ghGnv7RgnxeeIxzj1CdfVecU3xEWydH_imIvVfgXhyp");

const talkedRecently = new Set();

var request = require('request');

const {dashboardurl, dashboardtoken} = require("../config.json")


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
  

function setUserBal(mail, credits) {
    return new Promise(function(resolve, reject) {
        const options = {
            uri: dashboardurl + '/api/users/1/increment?filter[email]='+mail,
            method: 'PATCH',
            headers: {
            'User-Agent': 'YourHostBackend',
            'Authorization': 'Bearer ' + dashboardtoken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            },
            form: {
                'credits': ''+credits+'',
              }
        };
  
        request(options, function (error, response, body) {
            if (response.statusCode !== 200) { reject(response.statusCode) }
            resolve(body)
        });
    });
  }

module.exports.run = async (bot, message, args) => {

  
      if (talkedRecently.has(message.author.id)) {
          message.reply("You can do this command every 1 day");
    } else {
            let randomn = Math.random() * (300 - 1) + 1;

            var number = Math.floor(randomn);

            const discorId = message.author.id;

            GetUser2(discorId)
            .then( ( email ) => {
                setUserBal(email, number)
                message.reply("You claimed your weekly and got: " + number + "$");
            } )
            .catch( ( err ) => {
                message.reply("You are not registered on our site");
            } );
            

            talkedRecently.add(message.author.id);
            setTimeout(() => {
                talkedRecently.delete(message.author.id);
            }, 60000 * 60 * 12 * 7); 
        }
}



module.exports.help = {
  name:"weekly"
}