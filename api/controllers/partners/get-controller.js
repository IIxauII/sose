const dbConnector = require('../../db_connector');

async function fetchAllPartnersFromDb() {
    return new Promise(async (resolve, reject) => {
        await dbConnector.openAndReturnDB().then(async (db) => {
            db.on('open', async () => {
                db.all('SELECT * FROM partners;', async (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    await dbConnector.closeDB(db);
                    resolve(data.map((partner) => {
                        return {
                            name: partner.name,
                            address: partner.address,
                            here_id: partner.here_id,
                            lat: partner.lat,
                            lng: partner.lng,
                        };
                    }));
                });
            });
        });
    });
}

function calculateDistance(partner, location) {
    const lat1 = location.lat;
    const lng1 = location.lng;
    const lat2 = partner.lat;
    const lng2 = partner.lng;
    const p = 0.017453292519943295;    // Math.PI / 180
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lng2 - lng1) * p))/2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

function roundDistance(rawDistance) {
    if (rawDistance > 2) {
        return Math.round(rawDistance);
    } else {
        return Math.round(rawDistance * 10) / 10;
    }
}

module.exports = {
    async getPartners(ctx) {
        console.log('FETCHING PARTNERS');
        try {
            let promise = new Promise(async (resolve, reject) => {
                await fetchAllPartnersFromDb()
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((err) => {
                        reject(err);
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
            ctx.throw(400, 'PARTNERS MAYDAY!');
        }
    },
    async getNearestPartners(ctx) {
        console.log('FETCHING NEAREST PARTNERS');
        try {
            if (!ctx.request.query || !ctx.request.query.lat || !ctx.request.query.lng || !ctx.request.query.maxDistance) {
                throw Error('Query missing or wrong format!');
            } else {
                const location = {
                    lat: ctx.request.query.lat,
                    lng: ctx.request.query.lng,
                };
                const maxDistance = ctx.request.query.maxDistance;
                const partners = await fetchAllPartnersFromDb();
                const tempPartners = partners.map((partner) => {
                    const rawDistance = calculateDistance(partner, location);
                    return {
                        ...partner,
                        distance: roundDistance(rawDistance),
                    };
                });
                const partnersInRange = tempPartners.filter((partner) => partner.distance <= maxDistance);
                console.log(partnersInRange.length);
                ctx.body = partnersInRange;
            }
        } catch (err) {
            console.log(err);
            ctx.throw(400, 'NEAREST PARTNERS MAYDAY!');
        }
    }
};