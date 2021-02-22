const Discord = require('discord.js');

function pageEmbed(index, pages) {
    msg.channel.send(new Discord.MessageEmbed()
                    .setColor('#21d92a')
                    .setTitle(pages[index].title)
                    .setDescription(pages[index].desc)
                )
                .then(embed => {
                    embed.react("◀️");
                    embed.react("▶️");

                    const filter = (reaction, user) => {
                        return emotes.includes(reaction.emoji.name) && user.id === msg.author.id;
                      };

                    embedMsg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                    .then(collected => {
                        const reaction = collected.first();

                        if(reaction.emoji.name == "◀️") {
                            index = index - 1 < 0 ? pages.title.length - 1 : index - 1;
                            pageEmbed(index, pages)
                            embed.delete({ timeout: 100 });
                        } else if (reaction.emoji.name == "▶️") {
                            index = index + 1 > pages.title.length - 1 ? 0 : index + 1;
                            pageEmbed(index, pages)
                            embed.delete({ timeout: 100 });
                        }

                        client.on("messageDelete", async (deletedMsg) => {
                            if(deletedMsg == msg) {
                                embed.delete();
                            }
                        });
                    });
                });
}

var postPageEmbed = function(client, msg, pages) {

    pageEmbed(0, pages);
};

module.exports = postPageEmbed;