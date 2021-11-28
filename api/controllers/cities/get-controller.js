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
          });
        });
      });

      promise.then(
        (res) => {
          return res;
        },
        (rej) => {
          throw rej;
        }
      );

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
            // could potentially also use a INNER JOIN here
            /*  const query = `SELECT * FROM cities_new INNER JOIN partners ON cities_new.city_id = partners.city_id WHERE cities_new.name = '${ctx.params.name}';`;
                        db.all(query, async (err, data) => {
                            if (err) {
                                reject(err);
                            }
                            console.log(data);
                            resolve(data);

                            await dbConnector.closeDB(db);
                        }); */

            db.get(`SELECT * FROM cities_new WHERE name = '${ctx.params.name}';`, async (err, cityData) => {
              if (err) {
                reject(err);
              }

              db.all(`SELECT * FROM partners WHERE city_id = ${cityData.city_id};`, async (err, partnersOfCityData) => {
                if (err) {
                  reject(err);
                }
                //ES9 Object Rest Operator
                //pretty sweet tbh
                const { city_id, ...cleanCityData } = cityData;
                const getCityReturnData = {
                  ...cleanCityData,
                  sodexoPartners: partnersOfCityData.map((partner) => {
                    const { city_id, partner_id, ...cleanPartner } = partner;
                    return cleanPartner;
                  }),
                };
                resolve(getCityReturnData);
                await dbConnector.closeDB(db);
              });
            });
          });
        });
      });
      promise.then(
        (res) => {
          return res;
        },
        (rej) => {
          throw rej;
        }
      );
      ctx.body = await promise;
    } catch (err) {
      console.log(err);
      ctx.throw(400, 'CITY MAYDAY!');
    }
  },
};
