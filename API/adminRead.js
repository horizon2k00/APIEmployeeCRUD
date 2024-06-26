const express = require('express');
const router = express.Router();
const Module = require('../modules/readModule.js');

//route gets paginated employee data 

router.get('/', Module.getEmpList);

//route gets paginated employee data sorted by requested key

router.get('/sortby', Module.getEmpSorted);

//route gets employees in requested department

router.get('/dept', Module.getEmpByDept);

//route gets employees above threshold rating sorted in descending order

router.get('/rating/gt', Module.getEmpGtRating);

//route gets employees below threshold rating sorted in ascending order

router.get('/rating/lt', Module.getEmpLtRating);

//route gets number of employees present in company

router.get('/count', Module.getTotalCount);

//route gets number of empliyees in specified department

router.get('/count/dept', Module.getDeptCount);

module.exports = router;