const Discord 	= require('discord.js');
const express = require('express');

const client 	= new Discord.Client();
const app 	= express();

const token = process.env.TOKEN;
const port 	= process.env.PORT || 3000;

const general = require('./commands/general');
const lovecraft = require('./commands/lovecraft');
const scp = require('./commands/scp');

app.listen(port, "0.0.0.0", function() {
	console.log(`Listening on port ${port}`);
});

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`);
	client.user.setActivity("pd help");
});

client.on('message', msg => {
    if (msg.author.bot || !msg.content.startsWith('pd')) return;

    switch(msg.content.split(' ')[1]) {
        case "scp":
            scp(client, msg);
        break;
        case "hpl":    
            lovecraft(client, msg);
        break;
        default:
            general(client, msg);
    }
});

client.login(token);
