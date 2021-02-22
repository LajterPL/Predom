const req = require('request');
const postEmbed = require('../util/postEmbed');

var randomImage = function(client, msg) {

    LookForImage();

    function LookForImage() {
        try {
            req({
            url: 'https://commons.wikimedia.org/w/api.php?action=query&list=random&format=json',
            json: true}, 
            async function (error, response, randomQuery) {

                var title = await randomQuery.query.random[0].title;

                if (title.includes(".jpg") || title.includes(".png")) {

                    var id = await randomQuery.query.random[0].id;

                    req({
                    url: 'https://commons.wikimedia.org/w/api.php?action=query&pageids='+ id +'&prop=imageinfo&iiprop=extmetadata&format=json',
                    json: true},
                    async function (error, response, detailsQuery) {
    
                        try {

                            var license = await detailsQuery.query.pages[id].imageinfo[0].extmetadata.LicenseShortName.value;

                            if (license.includes('Public domain') || license.includes('CC BY-SA 3.0') || license.includes('CC BY-SA 4.0') || license.includes('CC0')) {
                                
                                title = title.replace(/ /g, "_");

                                var image = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + title.slice(5);
                                var link = 'https://commons.wikimedia.org/wiki/'+ title;
                           
                                postEmbed(client, msg, msg.channel, "Random image", "", link, null, image);

                            } else { LookForImage(); }

                        } catch (e) { LookForImage(); }
    
                    });
                } else { LookForImage(); }
            });
        } catch (e) { LookForImage(); }
    }

}

module.exports = randomImage;