"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const updateModule_1 = require("../modules/updateModule");
//update api to update multiple salaries at once
router.put('/salary', updateModule_1.UpdateModule.bulkUpdate);
//update api to update multiple ratings at once
router.put('/rating', updateModule_1.UpdateModule.bulkUpdate);
//update api to update multiple employee ages at once
router.put('/age', updateModule_1.UpdateModule.bulkUpdate);
module.exports = router;
