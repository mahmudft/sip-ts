const express = require('express');
const dotenv = require('dotenv');
const router = require('./libs/router');
var bodyParser = require('body-parser');
const db = require('./db/database');

const app = express();

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', router)

app.listen(3002, () => {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT,username TEXT, password TEXT, email TEXT NOT NULL UNIQUE, phone TEXT, registered_at TIMESTAMP DEFAULT NULL, token_date TIMESTAMP DEFAULT NULL)`)
    })
    console.log(`Server is listening on :3002`)
})