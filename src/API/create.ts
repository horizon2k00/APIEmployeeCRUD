// const express = require('express');
import express from 'express';
const router = express.Router();
import {Verify} from '../modules/verifyData.js';
import {CreateModule} from '../modules/createModule.js';

//route to create new employee in file with given data
router.post('/', CreateModule.exists, 
    Verify.verifyEmail, 
    Verify.verifyName, 
    Verify.verifyAge, 
    Verify.verifyDep, 
    Verify.verifyPass, 
    Verify.verifyPos, 
    Verify.verifySal, 
    Verify.verifyPriv, 
    CreateModule.createEntry);


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