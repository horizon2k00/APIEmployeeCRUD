const express = require('express');
const router = express.Router();
const Module = require('../modules/salarylistModule.js');




//route to download csv of salary details
router.get('/report/download', Module.downloadReport);

//route to get top n salaries from data
router.get('/top', Module.getTop);

//rout to show average salary of employee in company
router.get('/average', Module.getAvg);

//route shows average sal of each dept in one response
router.get('/average/dept/all', Module.getDeptAvg)

//route shows average salary of requested department
router.get('/average/dept', Module.getAvgByDept)

//route shows max and min sal in requested dept
router.get('/dept', Module.getDeptMaxMin)

module.exports = router;