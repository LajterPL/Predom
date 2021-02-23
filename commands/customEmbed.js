const postEmbed = require("../util/postEmbed.js");

const customEmbed = function(client, msg) {
	if(!msg.member.roles.cache.some(role => role.permissions.has(0x8))) return;

	var args = msg.content.split("/;");

	var channel = msg.channel;
	var title = "";
	var desc = "";
	
	link = null;
	thumbnail = null;
	image = null;

	switch(args.length) {
		case 6:
			image = args[5] != "" ? args[5] : null;
		case 5:
			thumbnail = args[4] != "" ? args[4] : null;
		case 4:
			link = args[3] != "" ? args[3] : null;
		case 3:
			var channelid = args[2].trim();
			channelid = channelid.slice(2, -1);

			if(channelid < 18) channel = msg.channel;
			else channel = client.channels.cache.get(channelid);
		case 2:
			desc = args[1];
		case 1:
			title = args[0].slice(7);
	}

	console.log(`${msg.author.username}: ${msg.content}`);
    postEmbed(client, msg, channel, title, desc, link, thumbnail, image, msg.author.tag, msg.author.avatarURL());   
};

module.exports = customEmbed;