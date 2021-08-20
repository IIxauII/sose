const sqlite3 = require('sqlite3');
const fs = require('fs');
const path = require('path');
const serverConfig = require('./config/saver-config.json');

async function openAndReturnDB() {
    sqlite3.verbose();
    let db = new sqlite3.Database(serverConfig.db.path + serverConfig.db.name, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the db');
    });

    return db;
}

async function closeDB(db) {
    await db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}

async function execDBQuerys(querys) {
    // opening db connection
    let db = await openAndReturnDB();
    //console.log(querys[0]);
    db.serialize(() => {
        querys.forEach((query) => {
            db.exec(query, (err) => {
                if (err) throw err;
            })
        })
    })

    await closeDB(db);
}

fs.readdir(serverConfig.input.path, {}, async (err, fileNames) => {
    if (err) {
        throw err;
    } else {
        console.log('read dir %s', serverConfig.input.path);
        console.log(fileNames);
        // only process filenames with .json format
        fileNames = fileNames.filter(el => path.extname(el) === '.json');
        console.log(fileNames);

        if (fileNames.length) {

            // looping over files in directory & loading them individually to save data in DB
            let preparedQuerys = [];
            fileNames.forEach((fileName, fileIndex) => {
                const inputFilePath = serverConfig.input.path + fileName;

                const data = fs.readFileSync(inputFilePath, 'utf-8');
                console.log('Loaded file: %s', inputFilePath);
                console.log(data.length);
                
                let name = fileName.slice(0, -5);
                name = name.substring(name.indexOf('-') + 1);
                name = name[0].toUpperCase() + name.substring(1);
                
                let postalCode = '000';

                let partners = JSON.stringify(data).replace(/'/g, "");

                //process.exit(1);
                //preparedQuery += `'${name}', '${postalCode}', '${partners}', `;
                preparedQuerys.push(`REPLACE INTO cities VALUES ('${name}', '${postalCode}', '${partners}')`);

                //deleting now processed .json file
                fs.unlink(inputFilePath, (err) => {
                    if (err) {
                        throw err;
                    } else {
                        console.log('Done processing, deleting %s', inputFilePath);
                    }
                });

                if (fileIndex === fileNames.length - 1) {
                    execDBQuerys(preparedQuerys);
                }
            })
        }
    }
})
