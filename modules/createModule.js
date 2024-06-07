const { getEmp } = require('../modules/filterData.js');
const { isAdmin, findEmp } = require('../modules/verifyData.js');

class Module {
    static fs = require('fs');
    static path = require('path');
    static datapath = Module.path.join(__dirname, '../DATA/data.json');
    static bcrypt = require('bcrypt');

    static exists(req, res, next) {
        if (!Module.fs.existsSync(Module.datapath)) {
            Module.fs.writeFileSync(Module.datapath, '[]');
        }
        next();
    }

    //creates new employee object with given details and adds to employee data file
    static createEntry(req, res) {
        const employees = getEmp();
        const index = findEmp(employees, 'email', req.body.email);
        req.body.joinDate = Date(Date.now()).slice(4, 15);
        req.body.rating = 3;
        if (index === -1) {
            if (employees.length === 0) {
                req.body.id = 1;
            } else {
                req.body.empId = employees[employees.length - 1].empId + 1;
            }
            Module.bcrypt.hash(req.body.password, 5).then((hash) => {
                req.body.password = hash;
                employees.push(req.body);
                Module.fs.writeFileSync(Module.datapath, JSON.stringify(employees));
                res.send('Employee added sucessfully');
            });
        } else {
            res.send('This email is in use');
        }
    }
}
module.exports = Module;