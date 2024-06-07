const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { verifyIndexByEmail } = require('../modules/updateModule.js');

function confirmPass (req, res) {
    bcrypt.compare(req.body.password, res.employees[res.index].password).then((result) => {
        if (result) {
            // console.log(path.resolve(__dirname, '../.env'));
            const secretKey = process.env.SECRET_KEY;
            console.log(process.env.SECRET_KEY);
            const payload = {
                email: req.body.email,
                audience: 'employee storage',
                privilege: res.employees[res.index].privilege
            };
            const token = jwt.sign(payload, secretKey);
            console.log(token);
            res.append('access_token', token);
            res.send('Successfully logged in');
        } else {
            res.send('Password Incorrect');
        }
    });
}

//route verifies email and password and sends jwt access token on successful verification

router.post('/', verifyIndexByEmail, confirmPass);

module.exports = router;