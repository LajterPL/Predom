const Discord = require('discord.js');

var postEmbed = function(client, msg, channel, title, desc, link = null, thumbnail = null, image = null, footerName = "", footerImage = null, authorName = "", authorImage = null, authorLink = null) {
  try {
    channel.send(new Discord.MessageEmbed()
        .setColor('#377fb2')
        .setTitle(title)
        .setDescription(desc)
        .setURL(link)
        .setThumbnail(thumbnail)
        .setImage(image)
        .setFooter(footerName, footerImage)
        .setAuthor(authorName, authorImage, authorLink))

    .then(embed => {
        client.on("messageDelete", async (deletedMsg) => {
            if(deletedMsg == msg) {
                embed.delete();
            }
        });
    });

  } catch (e1) {
    try {
        channel.send(new Discord.MessageEmbed()
            .setColor('#377fb2')
            .setTitle(title)
            .setDescription(desc)
            .setURL(link)
            .setThumbnail(thumbnail)
            .setImage(image))

        .then(embed => {
            client.on("messageDelete", async (deletedMsg) => {
                if(deletedMsg == msg) {
                    embed.delete();
                }
            });
        });

    } catch (e2) {console.log(e2)}
  }
};

module.exports = postEmbed;
