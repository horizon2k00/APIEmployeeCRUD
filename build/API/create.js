"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require('express');
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const verifyData_js_1 = require("../modules/verifyData.js");
const createModule_js_1 = require("../modules/createModule.js");
//route to create new employee in file with given data
router.post('/', createModule_js_1.CreateModule.exists, verifyData_js_1.Verify.verifyEmail, verifyData_js_1.Verify.verifyName, verifyData_js_1.Verify.verifyAge, verifyData_js_1.Verify.verifyDep, verifyData_js_1.Verify.verifyPass, verifyData_js_1.Verify.verifyPos, verifyData_js_1.Verify.verifySal, verifyData_js_1.Verify.verifyPriv, createModule_js_1.CreateModule.createEntry);
// router.post('/many',exists,(req,res)=>{
//     const emp = require('../refdata.json')
//     // const employees = getEmp();
//     emp.map((e)=>{
//         e.password = bcrypt.hashSync(e.password,5);
//     });
//     fs.writeFileSync(datapath,JSON.stringify(emp));
//     res.send(emp);
// });
module.exports = router;
