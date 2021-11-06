const dbConnector = require('../../db_connector');

module.exports = {
    async getExample(ctx) {
        console.log('hello!');
        try {
            ctx.body = 'This is a get example!';
        } catch (err) {
            console.log(err);
            ctx.throw(400, 'UPSI!');
        }
    },
    async getCities(ctx) {
        // https://www.sqlitetutorial.net/sqlite-nodejs/query/
        console.log('FETCHING CITIES');
        try {
            let promise = new Promise(async (resolve, reject) => {
                await dbConnector.openAndReturnDB().then(async (db) => {
                    db.on('open', async () => {
                        db.all('SELECT * FROM cities;', async (err, data) => {
                            if (err) {
                                reject(err);
                            }
                            let cityData = [];
                            data.forEach((city) => {
                                cityData.push({
                                    name: city.name,
                                    lat: city.lat,
                                    lng: city.lng,
                                });
                            });
                            resolve(cityData);
                            await dbConnector.closeDB(db);
                        });
                    })
                });
            });

            promise.then(
                (res) => {
                    return res;
                },
                (rej) => {
                    throw rej;
                });

            ctx.body = await promise;
        } catch (err) {
            console.log(err);
            ctx.throw(400, 'CITIES MAYDAY!');
        }
    },
    // this is currently case sensitive
    async getCity(ctx) {
        try {
            console.log(ctx.params.name);
            let promise = new Promise(async (resolve, reject) => {
                await dbConnector.openAndReturnDB().then(async (db) => {
                    db.on('open', async () => {
                        db.all(`SELECT * FROM cities WHERE name = '${ctx.params.name}';`, async (err, data) => {
                            if (err) {
                                reject(err);
                            }
                            //console.log(data);
                            resolve(data);
                            await dbConnector.closeDB(db);
                        });
                    })
                });
            });
            promise.then(
                (res) => {
                    return res;
                },
                (rej) => {
                    throw rej;
                });
            ctx.body = await promise;
        } catch (err) {
            console.log(err);
            ctx.throw(400, 'CITY MAYDAY!');
        }
    }
};