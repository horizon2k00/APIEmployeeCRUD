// const express = require('express');
import express from 'express';
const router = express.Router();
import {ReadModule} from '../modules/readModule.js';

//route gets paginated employee data 

router.get('/', ReadModule.getEmpList);

//route gets paginated employee data sorted by requested key

router.get('/sortby', ReadModule.getEmpSorted);

//route gets employees in requested department

router.get('/dept', ReadModule.getEmpByDept);

//route gets employees above threshold rating sorted in descending order

router.get('/rating/gt', ReadModule.getEmpGtRating);

//route gets employees below threshold rating sorted in ascending order

router.get('/rating/lt', ReadModule.getEmpLtRating);

//route gets number of employees present in company

router.get('/count', ReadModule.getTotalCount);

//route gets number of empliyees in specified department

router.get('/count/dept', ReadModule.getDeptCount);

module.exports = router;