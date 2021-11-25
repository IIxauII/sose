const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const serverConfig = require('../../config/saver-config.json');

console.time('dbCleanup');

sqlite3.verbose();
open({
  filename:
    '../../' +
    serverConfig.db.path +
    serverConfig.db.name,
  driver: sqlite3.Database,
})
  .then(async (db) => {
    console.log(
      'DB connection is up, ready for saving new data!'
    );

    // enabling foreign keys for sqlite db
    console.log('Enabling foreign keys for db');
    await db.exec('PRAGMA foreign_keys = ON;');

    // Fetching all data from old cities table
    console.log('Fetching old cities data');
    const data = await db.all(
      'Select * FROM cities;'
    );

    // needs to get removed later, dropping tables on every setup
    console.log('dropping existing tables');
    await db.exec('DROP TABLE partners');
    await db.exec('DROP TABLE cities_new');
    
    // Creating temp new table for cities
    console.log('Creating new cities table');
    await db.exec(
      'CREATE TABLE cities_new (city_id INTEGER PRIMARY KEY, name TEXT, post_code INT, here_id TEXT, lat REAL, lng REAL, unique (name, post_code, here_id))'
    );
    // Creating new table for partners
    console.log('Creating new partners table');
    await db.exec(
      'CREATE TABLE partners (partner_id integer PRIMARY KEY, name TEXT, address TEXT, here_id TEXT, lat REAL, lng REAL, city_id INTEGER NOT NULL, FOREIGN KEY (city_id) REFERENCES cities_new (city_id) ON UPDATE CASCADE ON DELETE CASCADE)'
    );

    console.log('Preparing SQL queries based on old data');
    preparedQuerys = [];
    x = 1;
    data.forEach((city) => {
        // add query for adding a new city to cities_new table
        const addCityQuery = `INSERT INTO cities_new (name, post_code, here_id, lat, lng) VALUES ('${city.name}', '${city.post_code}', '${city.here_id}', '${city.lat}', '${city.lng}')`;
        preparedQuerys.push(addCityQuery);

        // add queries for adding partners of current city to partners table
        const sodexoPartners = JSON.parse(city.sodexo_partners);
        sodexoPartners.forEach((partner) => {
            const addPartnerQuery = `INSERT INTO partners (name, address, here_id, lat, lng, city_id) VALUES ('${partner.name}', '${partner.address}', '${partner.here_id}', '${partner.lat}', '${partner.lng}', '${x}')`;
            preparedQuerys.push(addPartnerQuery);
        });
        ++x;
    });

    console.log('To be executed queries', preparedQuerys.length);

    console.log('Executing prepared queries');
    lastPercentage = 0;
    db.getDatabaseInstance().serialize(() => {
        preparedQuerys.forEach(async (query) => {
            await db.exec(query, (statement, err) => {
                if (err) throw err;
            }).finally(() => {
                const currentPercentage = Math.round((preparedQuerys.indexOf(query) + 1)/preparedQuerys.length*100);
                if (currentPercentage > lastPercentage && currentPercentage % 5 === 0) {
                  console.log(`${currentPercentage}%`);
                }
                lastPercentage = currentPercentage;
            })
        })
    })

    await db.close().finally(() => {
        console.log('Say bb to db!');
        console.timeEnd('dbCleanup');
        process.exit();
    })
  })
  .catch((err) => {
    throw err;
  });
