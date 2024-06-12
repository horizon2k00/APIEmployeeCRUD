import express from "express";
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
import { UpdateModule } from '../modules/updateModule.js';
import { Request, Res } from "../modules/typeDefinitions.js";

function confirmPass(req: Request, res: Res) {
    bcrypt.compare(req.body.password, res.employees[res.index].password).then((result: boolean) => {
        if (result) {
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

router.post('/', UpdateModule.verifyIndexByEmail, confirmPass);

module.exports = router;