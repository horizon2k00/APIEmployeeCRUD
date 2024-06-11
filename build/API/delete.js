"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const deleteModule_js_1 = require("../modules/deleteModule.js");
const verifyData_js_1 = require("../modules/verifyData.js");
//route deletes all employee data from data file
router.delete('/all', deleteModule_js_1.DeleteModule.deleteAll);
//route deletes data of employee with specified id 
router.delete('/:id', verifyData_js_1.Verify.verifyIndex, deleteModule_js_1.DeleteModule.deleteId);
module.exports = router;
