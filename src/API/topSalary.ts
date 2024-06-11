import express from "express";
const router = express.Router();
import {SalaryModule} from '../modules/salarylistModule.js';




//route to download csv of salary details
router.get('/report/download', SalaryModule.downloadReport);

//route to get top n salaries from data
router.get('/top', SalaryModule.getTop);

//rout to show average salary of employee in company
router.get('/average', SalaryModule.getAvg);

//route shows average sal of each dept in one response
router.get('/average/dept/all', SalaryModule.getDeptAvg)

//route shows average salary of requested department
router.get('/average/dept', SalaryModule.getAvgByDept)

//route shows max and min sal in requested dept
router.get('/dept', SalaryModule.getDeptMaxMin)

module.exports = router;