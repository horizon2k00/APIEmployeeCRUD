const { authorizedUser, findEmp, checkIndex, isAdmin } = require('./verifyData.js');
const { getEmp, getChangeLogs } = require('./filterData.js');

class Module {
    static fs = require('fs');
    static path = require('path');
    static changepath = Module.path.join(__dirname, '../DATA/changeLog.json');
    static datapath = Module.path.join(__dirname, '../DATA/data.json');
    static bcrypt = require('bcrypt');

    //Middleware driver to bulk update sal, age or rating
    
    static bulkUpdate(req, res) {
        const param = req.route.path.slice(1, 2);
        Module.argBulkUpdate(req, res, param);
    }
    //actual bulk update function
    
    static argBulkUpdate(req, res, arg) {
        if (arg === 's') { arg = 'salary'; }
        else if (arg === 'r') { arg = 'rating'; }
        else if (arg === 'a') { arg = 'age'; }
        else { res.send('path error') }
        const employees = getEmp();
        const changeLog = getChangeLogs();
        const ids = req.body;
        let inc = parseInt(req.query.inc);
        const updatedList = [];
        employees.map(emp => {
            ids.map(id => {
                if (emp.empId === id) {
                    const change = Module.createChangeLog(emp, changeLog);
                    change.before[arg] = emp[arg];
                    if (arg === 'salary') {
                        inc = emp[arg] * inc / 100;
                        emp[arg] += inc;
                    } else if (arg === 'rating') {
                        emp[arg] += inc;
                        if (emp[arg] > 5) { emp[arg] = 5; }
                        if (emp[arg] < 0) { emp[arg] = 0; }
                    }else if (arg === 'age'){
                        emp[arg] +=inc;
                    }
                    change.after[arg] = emp[arg];
                    change.updatedAt = Date.now();
                    changeLog.push(change);
                    updatedList.push({ empId: emp.empId, name: emp.name, email: emp.email, [arg]: emp[arg].toFixed(2) });
                }
            });
        });
        if (updatedList.length) {
            Module.fs.writeFileSync(Module.datapath, JSON.stringify(employees));
            Module.fs.writeFileSync(Module.changepath, JSON.stringify(changeLog));
            res.send(updatedList);
        } else {
            res.send('Employees with these ids do not exist')
        }
    }

    //employee update middleware. 
    
    static update(req, res) {
        const emp = getEmp();
        const changeLog = getChangeLogs();
        const change = { empId: parseInt(req.params.id), createdAt: Date.now(), before: {}, after: {} };
        if (changeLog.length === 0) {
            change.id = 1;
        } else {
            change.id = changeLog[changeLog.length - 1].id + 1;
        }
        if (req.body.email) {
            const index = findEmp(emp, 'email', req.body.email);
            if (index !== res.index && index !== -1) {
                res.send('This email is already in use for a different user');
            } else {
                change.before.email = emp[res.index].email;
                change.after.email = req.body.email;
                emp[res.index].email = req.body.email;
            }
        }
        if (req.body.name) {
            change.before.name = emp[res.index].name;
            change.after.name = req.body.name;
            emp[res.index].name = req.body.name;
        }
        if (req.body.age) {
            change.before.age = emp[res.index].age;
            change.after.age = req.body.age;
            emp[res.index].age = req.body.age;
        }
        if (req.body.position) {
            change.before.position = emp[res.index].position;
            change.after.position = req.body.position;
            emp[res.index].position = req.body.position;
        }
        if (req.body.department) {
            change.before.department = emp[res.index].department;
            change.after.department = req.body.department;
            emp[res.index].department = req.body.department;
        }
        if (req.body.salary) {
            change.before.salary = emp[res.index].salary;
            change.after.salary = req.body.salary;
            emp[res.index].salary = req.body.salary;
        }
        if (req.body.privilege) {
            change.before.privilege = emp[res.index].privilege;
            change.after.privilege = req.body.privilege;
            emp[res.index].privilege = req.body.privilege;
        }
        if (req.body.rating) {
            change.before.rating = emp[res.index].rating;
            change.after.rating = req.body.rating;
            emp[res.index].rating = req.body.rating;
        }
        change.updatedAt = Date.now();
        changeLog.push(change);
        Module.fs.writeFileSync(Module.datapath, JSON.stringify(emp));
        Module.fs.writeFileSync(Module.changepath, JSON.stringify(changeLog));
        res.send(`employee details updated: \n` + `${JSON.stringify(emp[res.index])}\nChangelog:${JSON.stringify(change)}`);
    }

    // gets index of emp with given id-stores in res.index
    
    static setRoute(req, res, next) {
        res.updateRoute = true;
        next();
    }

    //verify person trying to update pwd    --req.body.email === req.jwtPayload.email-- next() if true, error res if false
    
    static passAuth(req, res, next) {
        if (authorizedUser(req.jwtPayload, req.body, 'personal')) {
            next();
        } else {
            res.send("Incorrect email or you are trying to update an id that is not yours");
        }
    }

    //check if user is updating their own data, if not checks if admin. sends error response if both false
    
    static authorizeUser(req, res, next) {
        const employees = getEmp();
        if (authorizedUser(req.jwtPayload, employees[res.index])) {
            next();
        } else {
            res.send('You dont have access to update this information');
        }
    }

    //function to create new changelog obj -- returns changeLog obj

    static createChangeLog(emp, changeLog) {
        const change = { empId: emp.empId, createdAt: Date.now(), before: {}, after: {} };
        if (changeLog.length === 0) {
            change.id = 1;
        } else {
            change.id = changeLog[changeLog.length - 1].id + 1;
        }
        return change;
    }
    
    //Middleware to check if wmp with requested email exists
    static verifyIndexByEmail(req, res, next) {
        res.employees = getEmp();
        res.index = findEmp(res.employees, 'email', req.body.email);
        checkIndex(res.index, 'Invalid email', res, next);
    }
    
    //Middleware verifies old pass and updates to new pass
    
    static updatePwd(req, res) {
        const changeLog = getChangeLogs();
        const change = Module.createChangeLog(res.employees[res.index], changeLog);
        if (!Module.bcrypt.compareSync(req.body.oldPassword, res.employees[res.index].password)) {
            res.send('Old password incorrect');
        } else {
            Module.bcrypt.hash(req.body.password, 5).then((hash) => {
                change.before.password = res.employees[res.index].password;
                change.after.password = hash;
                res.employees[res.index].password = hash;
                change.updatedAt = Date.now();
                changeLog.push(change);
                Module.fs.writeFileSync(Module.changepath, JSON.stringify(changeLog));
                Module.fs.writeFileSync(Module.datapath, JSON.stringify(res.employees));
                res.send('Password updated successfully');
            });
        }
    }
}

module.exports = Module;