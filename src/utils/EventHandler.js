const fs = require('fs')

module.exports.info = {
    enabled: true
}

module.exports.run = Bot => {

fs.readdir("./events/", (err, files) => {
    if (err) console.error(err);
    let jsfiles = files.filter(f => f.split(".").pop() === "js"); 
    
    if (jsfiles.length <= 0) return console.warn("Warn │ No events have been found");
  
    console.info(`Info │ Loading ${jsfiles.length} event(s)...`);
    jsfiles.forEach((f, i) => {
      let props = require(`../events/${f}`);
      if(props.info.enabled === false) return;
      let event = props.info.name || f
      Bot.on(event, props.run.bind(null, Bot))
    });
  });
}