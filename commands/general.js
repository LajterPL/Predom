const postEmbed = require('../util/postEmbed');
const sendMessage = require('../util/sendMessage');

const randomImage = require('./randomImage');
const customEmbed = require('./customEmbed');

const generalCommands = function(client, msg) {
    switch(msg.content.split(" ")[1]) {
        case "help":

            var commandList =   ':pen_ballpoint: **General** \n' +
                                'pd `image`|`feedback cool bot`|`roll 1d20`|`choose this, that` \n \n' +
                                ':octopus: **H.P. Lovecraft** \n' +
                                'pd hpl `tale`|`monster`|`search cthulhu`|`random`\n \n' +
                                ':clipboard: **SCP Foundation** \n' +
                                'pd scp `tag euclid`|`en SCP-173`|`random`\n \n' +
                                '';

            if(msg.member.roles.cache.some(role => role.permissions.has(0x8))) {
	        	commandList += 	':star: **Admin commands** \n' +
	        				    'pd post `title /; description /; #channel /; url /; thumbnail /; image` ';
	        }
        
            postEmbed(client, msg, msg.channel, 'Commands', commandList, null, null, null, "", null, 'Github', 'https://raw.githubusercontent.com/WhiterPL/skipbot/v1.1/commands/assets/github_white.png', 'https://github.com/WhiterPL/Predom');
        
        break;
        case "feedback":

            console.log(`${msg.author.username}: ${msg.content.slice(12)}`);

        break;
        case "roll":
            if (msg.content.split(" ").length < 3) return;

            var desc = "You rolled... ";

            var args = msg.content.split(" ")[2].toLowerCase().split("d").length < 2 ? [1, msg.content.split(" ")[2].toLowerCase().split("d")[0]] : msg.content.split(" ")[2].toLowerCase().split("d");

            args[0] = args[0] == "" ? 1 : args[0];

            if(args[1] > 100_000_000 || args[0] > 20) {
                sendMessage(client, msg, "I'm sorry, but I don't have this many dices or they are just imposible to get.");
                return;
            } 

            var sum = 0;
            var results = "(";
            
            for(var i = 0; i < args[0]; i++) {

                var randomNumber = Math.floor((Math.random() * args[1]) + 1);

                sum += randomNumber;
                results += `${randomNumber} `;
            }

            results += ")";
            desc += `${sum} ${results}`;

            sendMessage(client, msg, desc);
        break;
        case "choose":
            var things = msg.content.slice(10).split(",");
            var thing = things[Math.floor(Math.random() * things.length)].trim();
            if(thing == "") return;

            sendMessage(client, msg, thing);
        break;
        case "image":
            randomImage(client, msg);
        break;
        case "post":
            customEmbed(client, msg);
        break;
    }
};

module.exports = generalCommands;