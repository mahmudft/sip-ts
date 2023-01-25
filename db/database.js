const sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "test.db"

let db = new sqlite3.Database(DBSOURCE, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err)
        throw err
    } else {
        console.log('Connected to the SQLite database.')
    }
});

module.exports = db;