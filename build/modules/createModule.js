"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateModule = void 0;
const filterData_js_1 = require("./filterData.js");
// const {getEmp} = require('./filterData.js');
const verifyData_js_1 = require("./verifyData.js");
class CreateModule {
    static exists(req, res, next) {
        if (!CreateModule.fs.existsSync(CreateModule.datapath)) {
            CreateModule.fs.writeFileSync(CreateModule.datapath, '[]');
        }
        next();
    }
    //creates new employee object with given details and adds to employee data file
    static createEntry(req, res) {
        const employees = filterData_js_1.FilterData.getEmp();
        const index = verifyData_js_1.Verify.findEmp(employees, 'email', req.body.email);
        req.body.joinDate = Date().slice(4, 15);
        req.body.rating = 3;
        if (index === -1) {
            if (employees.length === 0) {
                req.body.id = 1;
            }
            else {
                req.body.empId = employees[employees.length - 1].empId + 1;
            }
            CreateModule.bcrypt.hash(req.body.password, 5).then((hash) => {
                req.body.password = hash;
                employees.push(req.body);
                CreateModule.fs.writeFileSync(CreateModule.datapath, JSON.stringify(employees));
                res.send('Employee added sucessfully');
            });
        }
        else {
            res.send('This email is in use');
        }
    }
}
exports.CreateModule = CreateModule;
CreateModule.fs = require('fs');
CreateModule.path = require('path');
CreateModule.datapath = CreateModule.path.join(__dirname, '../DATA/data.json');
CreateModule.bcrypt = require('bcrypt');
// Createmodule.exports = CreateModule;
