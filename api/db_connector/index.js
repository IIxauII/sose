const sqlite3 = require('sqlite3');

module.exports = {
    async openAndReturnDB() {
        sqlite3.verbose();
        return new sqlite3.Database('../database/sodexo-akp.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the db');
        });
    },
    async closeDB(db) {
        await db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Closed the database connection.');
        });
    }
}