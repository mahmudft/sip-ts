const express = require('express');
const { createToken, checkAuth } = require('../auth/middleware');
const db = require('../db/database');
var exec = require('child_process').exec;

const router = express.Router();

router.post('/signin', (req, res) => {
    const { username, password } = req.body
    if(!username || !password){
        res.send("One of Fields is empty")
    }else{
        db.get(`select * from users where username = ?`, [username], (err, row) => {
            if (err) {
                res.send(err)
            } else {
                if(row){
                    if (password == row.password) {
                        const token = createToken(row)
                        res.status(200).json({token})
                    } else {
                        res.send("Password didnt match")
                    }
                }else {
                    res.status(200).send("Cant find user")
                }
            }
        });
    }

})

router.post('/signup', (req, res) => {
    const { username, password, phone, email } = req.body
    if (!username || !password || !phone || !email) {
        res.status(400).send('One of Fields is empty')
    }
    db.serialize(function () {
        db.run(
            `INSERT INTO users(username, password, phone, email) VALUES (?,?,?,?)`,
            [username, password, phone, email],
            function (error) {
                if (error) {
                    console.error(error.message);
                    res.json('Error happened on user creation')
                } else {
                    console.log(`Inserted a row with the ID: ${this.lastID}`);
                    res.send(`Inserted a row with the ID: ${this.lastID}`)
                }
            }
        );
    })
})

router.get('/info', checkAuth, (req, res) => {
    db.get(`select * from users where username = ?`, [req.user.username], (err, rows) => {
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            res.json(rows)
        }
    });

})


router.put('/info', checkAuth, (req, res) => {
    const {phone, email } = req.body
    db.serialize(function () {
        db.run(
            `UPDATE users SET phone = ?, email = ? where email = ?`,
            [phone, email, req.email],
            function (error) {
                if (error) {
                    console.error(error.message);
                    res.json('Error happened on user update')
                } else {
                    console.log(`Updated a row with the ID: ${this.lastID}`);
                    res.send(`Updated a row with the ID: ${this.lastID}`)
                }
            }
        );
    })


})


router.get('/latency', checkAuth, (req, res) => {
    exec("ping -c 1 www.google.com", function (err, stdout, stderr) {
        res.send(stdout);
    });
})

router.delete('/token', checkAuth,  (req, res) => {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE users SET token_date = null where username = ?`,
            [req.user.username],
            function (error) {
                if (error) {
                    console.error(error.message);
                    reject()
                    res.json('Error happened on token destroy')
                } else {
                    resolve()
                    res.send(`Token is removed`)
                }
            }
        );

    })
    
})

module.exports = router;