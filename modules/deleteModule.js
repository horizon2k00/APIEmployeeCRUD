const { isAdmin, findEmp, checkIndex } = require('../modules/verifyData.js');
const { getEmp } = require('../modules/filterData.js');

class Module {
    static fs = require('fs');
    static path = require('path');
    static datapath = Module.path.join(__dirname, '../DATA/data.json');

    static deleteAll(req, res) {
            const employees = getEmp();
            employees.splice(0, employees.length);
            Module.fs.writeFileSync(Module.datapath, JSON.stringify(employees));
            res.send(`All employees deleted`);
    }
    
    static deleteId(req, res) {
        res.employees.splice(res.index, 1);
        Module.fs.writeFileSync(Module.datapath, JSON.stringify(res.employees));
        res.send(`employee details deleted`);
    }
}
module.exports = Module;