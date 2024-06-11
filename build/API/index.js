"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
// const { jwtAuth, exists, checkAdmin } = require('../modules/verifyData.js');
const verifyData_1 = require("../modules/verifyData");
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// const fs = require('fs');
// const path = require('path');
// const datapath = path.join(__dirname,'/DATA/data.json');
// if(!fs.existsSync(datapath)){
//     fs.writeFileSync(datapath,'[]');}
//checks file exists and creates, not required anymore
const adminRead = require('./adminRead.js');
app.use('/emp', verifyData_1.Verify.jwtAuth, verifyData_1.Verify.exists, verifyData_1.Verify.checkAdmin, adminRead);
const allRead = require('./allRead.js');
app.use('/emp/', verifyData_1.Verify.jwtAuth, verifyData_1.Verify.exists, allRead);
const bulkUpdate = require('./bulkUpdate.js');
app.use('/update/bulk', verifyData_1.Verify.jwtAuth, verifyData_1.Verify.exists, verifyData_1.Verify.checkAdmin, bulkUpdate);
const empUpdate = require('./empUpdate.js');
app.use('/update', verifyData_1.Verify.jwtAuth, verifyData_1.Verify.exists, empUpdate);
const del = require('./delete.js');
app.use('/delete', verifyData_1.Verify.jwtAuth, verifyData_1.Verify.exists, verifyData_1.Verify.checkAdmin, del);
const useCreate = require('./create.js');
app.use('/create', verifyData_1.Verify.jwtAuth, verifyData_1.Verify.checkAdmin, useCreate);
const useLogin = require('./login.js');
app.use('/login', verifyData_1.Verify.exists, useLogin);
const salaryList = require('./topSalary.js');
app.use('/salarylist', verifyData_1.Verify.jwtAuth, verifyData_1.Verify.checkAdmin, verifyData_1.Verify.exists, salaryList);
app.listen(port, () => {
    console.log(`listening to port ${port}`);
});
