"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const salarylistModule_js_1 = require("../modules/salarylistModule.js");
//route to download csv of salary details
router.get('/report/download', salarylistModule_js_1.SalaryModule.downloadReport);
//route to get top n salaries from data
router.get('/top', salarylistModule_js_1.SalaryModule.getTop);
//rout to show average salary of employee in company
router.get('/average', salarylistModule_js_1.SalaryModule.getAvg);
//route shows average sal of each dept in one response
router.get('/average/dept/all', salarylistModule_js_1.SalaryModule.getDeptAvg);
//route shows average salary of requested department
router.get('/average/dept', salarylistModule_js_1.SalaryModule.getAvgByDept);
//route shows max and min sal in requested dept
router.get('/dept', salarylistModule_js_1.SalaryModule.getDeptMaxMin);
module.exports = router;
