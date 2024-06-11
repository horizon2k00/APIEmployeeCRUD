"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require('express');
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const readModule_js_1 = require("../modules/readModule.js");
//route gets paginated employee data 
router.get('/', readModule_js_1.ReadModule.getEmpList);
//route gets paginated employee data sorted by requested key
router.get('/sortby', readModule_js_1.ReadModule.getEmpSorted);
//route gets employees in requested department
router.get('/dept', readModule_js_1.ReadModule.getEmpByDept);
//route gets employees above threshold rating sorted in descending order
router.get('/rating/gt', readModule_js_1.ReadModule.getEmpGtRating);
//route gets employees below threshold rating sorted in ascending order
router.get('/rating/lt', readModule_js_1.ReadModule.getEmpLtRating);
//route gets number of employees present in company
router.get('/count', readModule_js_1.ReadModule.getTotalCount);
//route gets number of empliyees in specified department
router.get('/count/dept', readModule_js_1.ReadModule.getDeptCount);
module.exports = router;
