const sqlite3 = require('sqlite3');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const urlencode = require('urlencode');
const serverConfig = require('./config/saver-config.json');
const hereConfig = require('../configs/here.json');

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
    db.serialize(() => {
        querys.forEach((query) => {
            db.exec(query, (err) => {
                if (err) throw err;
            })
        })
    })

    await closeDB(db);
}

// fetching city data via here api
async function fetchHereData(cityName) {
    const hereApiCall = hereConfig.baseUrl + 
                        hereConfig.endpoints.geocode + 
                        hereConfig.queryStrings.query + 
                        urlencode(cityName) + 
                        hereConfig.queryStrings.germany + 
                        hereConfig.queryStrings.apiKey + 
                        hereConfig.apiKey;
    return await axios.get(hereApiCall)
        .then((res) => {
            // TODO: maybe some error case checks?
            return {
                here_id: res.data.items[0].id,
                post_code: res.data.items[0].address.postalCode,
            };
        })
        .catch((err) => {
            return err;
        });
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
            fileNames.forEach(async (fileName, fileIndex) => {
                const inputFilePath = serverConfig.input.path + fileName;

                const data = fs.readFileSync(inputFilePath, 'utf-8');
                console.log('Loaded file: %s', inputFilePath);
                console.log(data.length);
                
                let name = fileName.slice(0, -5);
                name = name.substring(name.indexOf('-') + 1);
                name = name[0].toUpperCase() + name.substring(1);
                
                // fetching data via here api
                const hereData = await fetchHereData(name);
                const post_code = await hereData.post_code;
                const here_id = await hereData.here_id;

                // cleaning up sodexo partner data
                let partners = JSON.stringify(data).replace(/'/g, "");

                //process.exit(1);
                //preparedQuery += `'${name}', '${postalCode}', '${partners}', `;

                preparedQuerys.push(`REPLACE INTO cities VALUES ('${name}', '${post_code}', '${partners}', '${here_id}')`);

                //deleting now processed .json file
                fs.unlink(inputFilePath, (err) => {
                    if (err) {
                        throw err;
                    } else {
                        console.log('Done processing, deleting %s', inputFilePath);
                    }
                });

                // executing gathered db querys
                if (fileIndex === fileNames.length - 1) {
                    execDBQuerys(preparedQuerys);
                }
            })
        }
    }
})
