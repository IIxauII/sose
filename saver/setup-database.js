const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const serverConfig = require('./config/saver-config.json');

sqlite3.verbose();
open({
    filename: serverConfig.db.path + serverConfig.db.name,
    driver: sqlite3.Database
}).then(async (db) => {
    console.log('DB connection is up, ready for saving new data!');

    // creates database table structure
    // cities
    // name | post_code | sodexo_partners
    await db.exec('CREATE TABLE cities (name TEXT, post_code INT, sodexo_partners TEXT, unique (name, post_code))')

    //await db.exec('DROP TABLE cities');

    console.log('Say bb to db!');
    db.close();
}).catch((err) => {
    throw err;
})