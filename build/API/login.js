"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const updateModule_js_1 = require("../modules/updateModule.js");
function confirmPass(req, res) {
    bcrypt.compare(req.body.password, res.employees[res.index].password).then((result) => {
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
        }
        else {
            res.send('Password Incorrect');
        }
    });
}
//route verifies email and password and sends jwt access token on successful verification
router.post('/', updateModule_js_1.UpdateModule.verifyIndexByEmail, confirmPass);
module.exports = router;
