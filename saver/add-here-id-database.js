const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const axios = require('axios');
const urlencode = require('urlencode');
const hereConfig = require('../configs/here.json');
const serverConfig = require('./config/saver-config.json');

sqlite3.verbose();
open({
    filename: serverConfig.db.path + serverConfig.db.name,
    driver: sqlite3.Database
}).then(async (db) => {
    // TODO: Clean up console logs & data processing
    console.log('DB connection is up, ready for saving new data!');
    const data = await db.all('SELECT * FROM cities;');
    console.log('should have executed');
    let onlyCityNames = [];
    data.forEach((city) => {
        onlyCityNames.push(city.name);
    });
    console.log(onlyCityNames);
    const hereGeocodeEndpoint = 'https://geocode.search.hereapi.com/v1/geocode';
    const hereApiKey = '&apiKey=' + hereConfig.apiKey;
    onlyCityNames.forEach((cityName) => {
        const hereGeocodeQuery = '?q=' + urlencode(cityName) + ' Deutschland';
        const hereApiCall = hereGeocodeEndpoint + hereGeocodeQuery + hereApiKey;
        console.log(hereApiCall);
        axios.get(hereApiCall)
          .then(async (res) => {
            console.log('---');
            console.log(cityName);
            console.log(res.data.items[0].id);
            console.log('---');
            console.log('updating db entry with post_code & here_id for', cityName);
            await db.exec(`UPDATE cities SET post_code = '${res.data.items[0].address.postalCode}', here_id = '${res.data.items[0].id}' WHERE name = '${cityName}';`);
          })
          .catch((err) => {
            console.log('---');
            console.log(cityName);
            console.log(err);
            console.log('---');
          })
    });
    // TODO: Close database in a clean way using promises
}).catch((err) => {
    throw err;
})