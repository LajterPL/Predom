const axios = require("axios");
const cheerio = require("cheerio");

const postEmbed = require('../util/postEmbed');
const sendMessage = require('../util/sendMessage');

const tales = require('../assets/hplworks.json');
const monsters = require('../assets/hplmonsters.json');
const words = require('../assets/hplwords.json');

const lovercraft = function(client, msg) {
    if(msg.content.split(" ").length < 3) {
        var desc =  "Howard Phillips Lovecraft (August 20, 1890 – March 15, 1937) was an American writer of weird and horror fiction, who is known for his creation of what became the Cthulhu Mythos. \n" +
                     "— [Wikipedia](https://en.wikipedia.org/wiki/H._P._Lovecraft) \n \n" +
                    ":gear: **Commands** \n \n" +
                     "**pd hpl tale** \n" +
                     "– sends a link to the random Lovecraft's work \n \n" +
                    "**pd hpl monster** \n" +
                    "– sends a link to the random lovecraftian monster \n \n" +
                    "**pd hpl search** `cthulhu` \n" +
                    "– searches for the specified phrase on Lovecraft's wiki \n \n" +
                    "**pd hpl random** \n" +
                    "– generates random lovecraftian description \n \n";

        postEmbed(client, msg, msg.channel, "Howard Phillips Lovecraft", desc, null, 'https://upload.wikimedia.org/wikipedia/commons/1/10/H._P._Lovecraft%2C_June_1934.jpg');
    } else {
        switch(msg.content.split(" ")[2].trim()) {
            case "random":
                var desc =  `${words.discovery[Math.floor((Math.random() * words.discovery.length))]} ` +
                            `${words.adjective[Math.floor((Math.random() * words.adjective.length))]} ` +
                            `${words.object[Math.floor((Math.random() * words.object.length))]}` +
                            `${words.details[Math.floor((Math.random() * words.details.length))]}`;

                postEmbed(client, msg, msg.channel, "Random lovecraftian description", desc);
            break;
            case "tale":
                var randomTale = tales.works[Math.floor((Math.random() * tales.works.length))];
                try {
                    postEmbed(client, msg, msg.channel, randomTale.title, "", `https://www.hplovecraft.com/writings/texts/${randomTale.link}`);
                } catch (e) {console.error(e)}
            break;
            case "monster":
                var randomMonster = monsters.monsters[Math.floor((Math.random() * monsters.monsters.length))];
                try {
                    postEmbed(client, msg, msg.channel, randomMonster.title, "", `https://lovecraft.fandom.com${randomMonster.link}`);
                } catch (e) {console.error(e)}
            break;
            case "search":
                axios
                    .get(`https://lovecraft.fandom.com/wiki/Special:Search?query=${encodeURI(msg.content.slice(14))}&scope=internal&navigationSearch=true`)
                    .then(res => {
                        const html = res.data;
                        const $ = cheerio.load(html);

                        var title = $("a.unified-search__result__title:first").attr('data-title');
                        var link = $("a.unified-search__result__title:first").attr('href');
                        var preview = $("div.unified-search__result__content:first").text();

                        if (title == null) {
                            sendMessage(client, msg, "*No results*")
                        } else {
                            try {
                                postEmbed(client, msg, msg.channel, title, preview, link);
                            } catch (e) {console.error(e)}
                        }
                        
                    })
                    .catch(e => {
                        console.error(e);
                    });
            break;
        }
    }
    
};

module.exports = lovercraft;