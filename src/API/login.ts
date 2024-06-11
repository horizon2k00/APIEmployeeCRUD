import express from "express";
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
import {UpdateModule} from '../modules/updateModule.js';
interface employee {
    [index:string]:number|string;
    empId:number;
    name: string;
    position: string;
    department:string;
    salary:number;
    email:string;
    password:string;
    age:number;
    privilege:string;
    joinDate:string;
    rating:number;
}

function confirmPass (req: { body: { password: string; email: string; }; }, res: { employees: employee[]; index: number; append: (arg0: string, arg1: any) => void; send: (arg0: string) => void; }) {
    bcrypt.compare(req.body.password, res.employees[res.index].password).then((result: boolean) => {
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

router.post('/', UpdateModule.verifyIndexByEmail, confirmPass);

module.exports = router;