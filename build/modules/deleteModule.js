"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteModule = void 0;
const filterData_js_1 = require("./filterData.js");
class DeleteModule {
    static deleteAll(req, res) {
        const employees = filterData_js_1.FilterData.getEmp();
        employees.splice(0, employees.length);
        DeleteModule.fs.writeFileSync(DeleteModule.datapath, JSON.stringify(employees));
        res.send(`All employees deleted`);
    }
    static deleteId(req, res) {
        res.employees.splice(res.index, 1);
        DeleteModule.fs.writeFileSync(DeleteModule.datapath, JSON.stringify(res.employees));
        res.send(`employee details deleted`);
    }
}
exports.DeleteModule = DeleteModule;
DeleteModule.fs = require('fs');
DeleteModule.path = require('path');
DeleteModule.datapath = DeleteModule.path.join(__dirname, '../DATA/data.json');
