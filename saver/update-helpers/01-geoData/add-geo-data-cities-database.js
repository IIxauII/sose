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
    let onlyCityNames = [];
    data.forEach((city) => {
        onlyCityNames.push(city.name);
    });
    console.log(onlyCityNames);
    const hereGeocodeEndpoint = 'https://geocode.search.hereapi.com/v1/geocode';
    const hereApiKey = '&apiKey=' + hereConfig.apiKey;

    let x = 0;
    function fetchAndSaveToDb() {
      let cityName = onlyCityNames[x];
      console.log(`${x+1} of ${onlyCityNames.length}`);
      console.log('Adding', cityName);
      const hereGeocodeQuery = '?q=' + urlencode(cityName) + ' Deutschland';
      const hereApiCall = hereGeocodeEndpoint + hereGeocodeQuery + hereApiKey;
      console.log(hereApiCall);
      axios.get(hereApiCall)
        .then(async (res) => {
          console.log('---');
          console.log(cityName);
          console.log(res.data.items[0].position);
          console.log('---');
          console.log('updating db entry with lat & lng for', cityName);
          await db.exec(`UPDATE cities SET lat = '${res.data.items[0].position.lat}', lng = '${res.data.items[0].position.lng}' WHERE name = '${cityName}';`);
        })
        .catch((err) => {
          console.log('---');
          console.log(cityName);
          console.log(err);
          console.log('---');
        })
      ++x;
      if (x <= onlyCityNames.length - 1) {
        setTimeout(() => {
          fetchAndSaveToDb();
        }, 250);
      } else {
        console.log('Done!');
      }
    }

    fetchAndSaveToDb();
    //TODO: Close database in a clean way using promises
}).catch((err) => {
    throw err;
})