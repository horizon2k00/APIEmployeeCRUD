"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const verifyData_1 = require("../modules/verifyData");
const updateModule_1 = require("../modules/updateModule");
// update route to update employee details
router.put('/emp/:id', updateModule_1.UpdateModule.setRoute, verifyData_1.Verify.verifyIndex, updateModule_1.UpdateModule.authorizeUser, verifyData_1.Verify.verifyName, verifyData_1.Verify.verifyAge, verifyData_1.Verify.verifyEmail, verifyData_1.Verify.verifyDep, verifyData_1.Verify.verifyPass, verifyData_1.Verify.verifyPos, verifyData_1.Verify.verifySal, verifyData_1.Verify.verifyPriv, verifyData_1.Verify.verifyRating, updateModule_1.UpdateModule.update);
// update route to update employee password
router.put('/password', updateModule_1.UpdateModule.passAuth, verifyData_1.Verify.verifyPass, updateModule_1.UpdateModule.verifyIndexByEmail, updateModule_1.UpdateModule.updatePwd);
module.exports = router;
