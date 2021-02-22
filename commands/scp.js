const http = require('http');

const postEmbed = require('../util/postEmbed');
const sendMessage = require('../util/sendMessage');

const words = require('../assets/scpwords.json');

var scp = function(client, msg) {
    if(msg.content.split(" ").length < 3) {
        var desc =  "The SCP Wiki is a collaborative urban fantasy writing website about the fictional SCP Foundation, a secretive organization that contains anomalous or supernatural items and entities away from the eyes of the public. \n" +
                    " — [SCP wiki](http://scp-wiki.wikidot.com/about-the-scp-foundation) \n \n" + 
                    ":gear: **Commands** \n \n" +
                    "**pd scp** `en 173` | `en are we cool yet?` |`pl keterownia` \n" +
                    "– searches for pages on a specified SCP branch \n \n" +
                    "**pd scp tag** `en tale` | `en euclid` \n" +
                    "– lists 5 random pages with specified tag \n \n";

        postEmbed(client, msg, msg.channel, "SCP Foundation",  desc, null, "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/SCP_Foundation_(emblem).svg/1200px-SCP_Foundation_(emblem).svg.png")
    } else {    
        switch(msg.content.split(" ")[2].trim()){
            case "random":
                desc =  `**Item #:** SCP-${Math.floor((Math.random() * 20_000) + 9_000)} \n` +
                        `**Object Class:** ${words.class[Math.floor(Math.random() * words.class.length)]} \n` +
                        `**Description:** \n` +
                        `The ${words.adjective[Math.floor(Math.random() * words.adjective.length)]} ` +
                        `${words.object[Math.floor(Math.random() * words.object.length)]}, that ` +
                        words.descriptor[Math.floor(Math.random() * words.descriptor.length)];

                postEmbed(client, msg, msg.channel, "Random SCP article", desc);
            break;
            case "tag":
                if(msg.content.split(" ").length < 4) return;

                var options = {
                    host: 'scpper.com',
                    path: '/api/',
                };
                
                var site = "en";
                var tag = "";

                if(msg.content.split(" ").length < 5) {
                    tag = msg.content.split(" ")[3].trim();
                } else {
                    site = msg.content.split(" ")[3].trim();
                    tag = msg.content.split(" ")[4].trim();
                }
                

                options.path += `tags?site=${site}&limit=5&random=1&tags=${encodeURI(tag)}`;

                http.get(options, function (res) {
                    var json = '';

                    res.on('data', function (chunk) {
                        json += chunk;
                    });

                    res.on('end', function () {
                        if (res.statusCode === 200) {
                            try {
                                var result = JSON.parse(json);
                                var list = '';

                                result.pages.forEach(page => {
                                    list += `[${page.title}](${page.site}/${page.name}) by **${page.authors[0].user}** *${page.rating}+* \n`;
                                });

                                postEmbed(client, msg, msg.channel, `Pages with tag: ${msg.content.split(" ")[4].trim()}`, list);
                            } catch (e) {
                                sendMessage(client, msg, "*No results*");
                            }
                        } else {
                            console.log('Status:', res.statusCode);
                        }
                    });
                })
                    .on('error', function (err) {
                        console.log('Error:', err);
                    });
            break;    
            default:

                var options = {
                    host: 'scpper.com',
                    path: '/api/',
                };

                var site = "en";
                var search = "";

                if(msg.content.split(" ").length < 5) {
                    search = msg.content.slice(14);
                } else {
                    site = msg.content.split(" ")[3].trim();
                    search = msg.content.slice(msg.content.search(site) + site.length + 1);
                }

                options.path += `find-pages?site=${site}&title=${encodeURI(search)}`;

                http.get(options, function (res) {
                    var json = '';

                    res.on('data', function (chunk) {
                        json += chunk;
                    });

                    res.on('end', function () {
                        if (res.statusCode === 200) {
                            try {
                                var result = JSON.parse(json);

                                postEmbed(client, msg, msg.channel, result.pages[0].title, `:writing_hand: **${result.pages[0].authors[0].user}** \n :star: **${result.pages[0].rating} +**`, `${result.pages[0].site}/${result.pages[0].name}`);
                            } catch (e) {
                                sendMessage(client, msg, "*No results*");
                            }
                        } else {
                            console.log('Status:', res.statusCode);
                        }
                    });
                })
                    .on('error', function (err) {
                        console.log('Error:', err);
                    });
        }   
    }    
};

module.exports = scp;