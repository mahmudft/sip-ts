const dotenv = require('dotenv');
const jwt = require('jsonwebtoken')
const moment = require('moment');
const db = require('../db/database');

dotenv.config();


async function checkAuth(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(403)

    await jwt.verify(token, process.env.TOKEN_SECRET, async(err, user) => {

        if (err) return res.sendStatus(403)

        req.user = user
        await validateUserTokenLifeTime(req, user)
        if (!req.isValid) return res.status(403).send("Token Expired")

        next()
    })
}

function createToken(user) {
    let now = new Date();
    db.run('update users set token_date = ? where username = ?', [moment(), user.username])
    return jwt.sign(user, process.env.TOKEN_SECRET)

}

function updateTokenExpiraton(username) {
    return new Promise((reslolve, reject) => {
        db.serialize(function () {
            db.run(
                `UPDATE users SET token_date = ? where username = ?`,
                [moment(), username],
                function (error) {
                    if (error) {
                        res.json('Error happened on user creation')
                    } else {
                        return true
                    }
                }
            );
        })
    })

}

async function validateUserTokenLifeTime(req,user) {
    return new Promise((resolve, reject) => {
        try {
            db.get(`select * from users where username = ?`, [user.username], (err, row) => {
                if (row.token_date) {
                    var now = moment();
                    var end = new Date(row.token_date);
                    var duration = moment.duration(now.diff(end));
                    if (duration.asMinutes() > 6) {
                        req.isValid = false
                        resolve()
                    } else {
                        req.isValid = true
                        updateTokenExpiraton(user.username)
                        resolve()
                        return true
                    }
                } else {
                    req.isValid = false
                    resolve()
                    return false
                }

            })
        } catch (error) {
            console.log(`Error With Select ALL(): \r\n ${error}`)
            reject();
        }
    });
}

module.exports = { createToken, checkAuth, updateTokenExpiraton };