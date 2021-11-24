const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const axios = require('axios');
const urlencode = require('urlencode');
const hereConfig = require('../../../configs/here.json');
const serverConfig = require('../../config/saver-config.json');

sqlite3.verbose();
open({
    filename: '../../' + serverConfig.db.path + serverConfig.db.name,
    driver: sqlite3.Database
}).then(async (db) => {
    // TODO: Clean up console logs & data processing
    console.log('DB connection is up, ready for saving new data!');
    const data = await db.all('SELECT * FROM cities;');
    console.log('should have executed');

    const hereGeocodeEndpoint = 'https://geocode.search.hereapi.com/v1/geocode';
    const hereApiKey = '&apiKey=' + hereConfig.apiKey;

    let x = 0;
    async function processCity() {
        const city = data[x];
        const partnerData = JSON.parse(city.sodexo_partners);
        console.log(partnerData);
        let y = 0;
        let processedPartnerDataOfCity = [];
        async function processPartnersOfCity() {
            const currentPartner = partnerData[y];
            console.log(`${x+1} of ${data.length} cities`);
            console.log('Processing', city.name);
            console.log(`${y+1} of ${partnerData.length} partners`);
            console.log('Processing', currentPartner.name);
            const hereGeocodeQuery = '?q=' + urlencode(currentPartner.address) + ' Deutschland';
            const hereApiCall = hereGeocodeEndpoint + hereGeocodeQuery + hereApiKey;
            console.log(hereApiCall);

            await axios.get(hereApiCall)
                .then((res) => {
                    console.log('---');
                    console.log(currentPartner.name);
                    console.log(res.data.items[0].id);
                    console.log('---');
                    processedPartnerDataOfCity.push({
                        ...currentPartner,
                        lat: res.data.items[0].position.lat,
                        lng: res.data.items[0].position.lng,
                        here_id: res.data.items[0].id,
                    })
                })
                .catch((err) => {
                    console.log('--ERROR-');
                    console.log(currentPartner.name);
                    console.log(err);
                    console.log('--ERROR-');
                });

            ++y;
            if (y <= partnerData.length - 1) {
                //console.log('continuing with next!');
                setTimeout(async () => {
                    await processPartnersOfCity();
                }, 0);
            } else {
                console.log('Done processing', city.name);
                console.log('Saving partner data of', city.name);
                await db.exec(`UPDATE cities SET sodexo_partners = '${JSON.stringify(processedPartnerDataOfCity)}' WHERE name = '${city.name}';`);

                ++x;
                if (x <= data.length - 1) {
                    setTimeout(async () => {
                        await processCity();
                    }, 50);
                } else {
                    console.log('Done!');
                }
            }
        }
        await processPartnersOfCity(); 
    }

    await processCity();
    //TODO: Close database in a clean way using promises
}).catch((err) => {
    throw err;
})