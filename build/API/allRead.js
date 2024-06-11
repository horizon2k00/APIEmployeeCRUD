"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const readModule_js_1 = require("../modules/readModule.js");
const verifyData_js_1 = require("../modules/verifyData.js");
//route gets employee data along with history of updates to employee details
router.get('/history/:id', verifyData_js_1.Verify.verifyIndex, readModule_js_1.ReadModule.getIdHistory);
//route gets details of emp with specified id
router.get('/:id', verifyData_js_1.Verify.verifyIndex, readModule_js_1.ReadModule.getId);
module.exports = router;
