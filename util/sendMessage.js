const Discord = require('discord.js');

var sendMessage = function(client, msg, text) {
    msg.channel.send(text)
    .then(botMsg => {
        client.on("messageDelete", async (deletedMsg) => {
            if(deletedMsg == msg) {
                botMsg.delete();
            }
        });    
    });
};

module.exports = sendMessage;