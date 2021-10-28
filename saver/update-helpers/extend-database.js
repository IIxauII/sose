const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const serverConfig = require('./config/saver-config.json');

// TODO: include this in `setup-database` 
//       OR 
//       extend setup shellscript to execute this `extend-database.js` file afterwards
//       OR
//       create new shellscript for extending existing installations (e.g. like a patch framework)

sqlite3.verbose();
open({
    filename: serverConfig.db.path + serverConfig.db.name,
    driver: sqlite3.Database
}).then(async (db) => {
    console.log('DB connection is up, ready for saving new data!');

    // extends database table structure & adds here_id column
    // cities
    // name | post_code | sodexo_partners | here_id
    await db.exec('ALTER TABLE cities ADD here_id TEXT');
    console.log('Say bb to db!');
    db.close();
}).catch((err) => {
    throw err;
})