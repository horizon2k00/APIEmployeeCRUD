const express = require('express');
const router = express.Router();
const Verify = require('../modules/verifyData.js');
const { exists, createEntry } = require('../modules/createModule.js');

//route to create new employee in file with given data
router.post('/', exists, 
    Verify.verifyEmail, 
    Verify.verifyName, 
    Verify.verifyAge, 
    Verify.verifyDep, 
    Verify.verifyPass, 
    Verify.verifyPos, 
    Verify.verifySal, 
    Verify.verifyPriv, 
    createEntry);


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