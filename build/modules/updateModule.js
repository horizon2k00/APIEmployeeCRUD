"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateModule = void 0;
const verifyData_js_1 = require("./verifyData.js");
const filterData_js_1 = require("./filterData.js");
class UpdateModule {
    //Middleware driver to bulk update sal, age or rating
    static bulkUpdate(req, res) {
        const param = req.route.path.slice(1, 2);
        UpdateModule.argBulkUpdate(req, res, param);
    }
    //actual bulk update function
    static argBulkUpdate(req, res, arg) {
        if (arg === "s") {
            arg = "salary";
        }
        else if (arg === "r") {
            arg = "rating";
        }
        else if (arg === "a") {
            arg = "age";
        }
        else {
            res.send("path error");
        }
        const employees = filterData_js_1.FilterData.getEmp();
        const changeLog = filterData_js_1.FilterData.getChangeLogs();
        const ids = req.body;
        if (typeof req.query.inc === 'string') {
            let inc = parseInt(req.query.inc);
            const updatedList = [];
            employees.map((emp) => {
                ids.map((id) => {
                    if (emp.empId === id) {
                        const change = UpdateModule.createChangeLog(emp, changeLog);
                        change.before[arg] = emp[arg];
                        if (arg === "salary") {
                            inc = (emp[arg] * inc) / 100;
                            emp[arg] += inc;
                        }
                        else if (arg === "rating") {
                            emp[arg] += inc;
                            if (emp[arg] > 5) {
                                emp[arg] = 5;
                            }
                            if (emp[arg] < 0) {
                                emp[arg] = 0;
                            }
                        }
                        else if (arg === "age") {
                            emp[arg] += inc;
                        }
                        change.after[arg] = emp[arg];
                        change.updatedAt = Date.now();
                        changeLog.push(change);
                        updatedList.push({
                            empId: emp.empId,
                            name: emp.name,
                            email: emp.email,
                            [arg]: emp[arg],
                        });
                    }
                });
            });
            if (updatedList.length) {
                UpdateModule.fs.writeFileSync(UpdateModule.datapath, JSON.stringify(employees));
                UpdateModule.fs.writeFileSync(UpdateModule.changepath, JSON.stringify(changeLog));
                res.send(updatedList);
            }
            else {
                res.send("Employees with these ids do not exist");
            }
        }
    }
    //employee update middleware.
    static update(req, res) {
        const emp = filterData_js_1.FilterData.getEmp();
        const changeLog = filterData_js_1.FilterData.getChangeLogs();
        let change = {
            id: 1,
            empId: parseInt(req.params.id),
            createdAt: Date.now(),
            before: {},
            after: {},
            updatedAt: 0,
        };
        if (changeLog.length !== 0) {
            if (typeof changeLog[changeLog.length - 1].id === 'number') {
                change.id = changeLog[changeLog.length - 1].id + 1;
            }
        }
        if (req.body.email) {
            const index = verifyData_js_1.Verify.findEmp(emp, "email", req.body.email);
            if (index !== res.index && index !== -1) {
                res.send("This email is already in use for a different user");
            }
            else {
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
        UpdateModule.fs.writeFileSync(UpdateModule.datapath, JSON.stringify(emp));
        UpdateModule.fs.writeFileSync(UpdateModule.changepath, JSON.stringify(changeLog));
        res.send(`employee details updated: \n` +
            `${JSON.stringify(emp[res.index])}\nChangelog:${JSON.stringify(change)}`);
    }
    // gets index of emp with given id-stores in res.index
    static setRoute(req, res, next) {
        res.updateRoute = true;
        next();
    }
    //verify person trying to update pwd    --req.body.email === req.jwtPayload.email-- next() if true, error res if false
    static passAuth(req, res, next) {
        if (verifyData_js_1.Verify.authorizedUser(req.jwtPayload, req.body, "personal")) {
            next();
        }
        else {
            res.send("Incorrect email or you are trying to update an id that is not yours");
        }
    }
    //check if user is updating their own data, if not checks if admin. sends error response if both false
    static authorizeUser(req, res, next) {
        const employees = filterData_js_1.FilterData.getEmp();
        if (verifyData_js_1.Verify.authorizedUser(req.jwtPayload, employees[res.index])) {
            next();
        }
        else {
            res.send("You dont have access to update this information");
        }
    }
    //function to create new changelog obj -- returns changeLog obj
    static createChangeLog(emp, changeLog) {
        let id;
        if (changeLog.length === 0) {
            id = 1;
        }
        else {
            id = changeLog[changeLog.length - 1].id + 1;
        }
        const change = {
            id,
            empId: emp.empId,
            createdAt: Date.now(),
            before: {},
            after: {},
            updatedAt: 0,
        };
        return change;
    }
    //Middleware to check if wmp with requested email exists
    static verifyIndexByEmail(req, res, next) {
        res.employees = filterData_js_1.FilterData.getEmp();
        res.index = verifyData_js_1.Verify.findEmp(res.employees, "email", req.body.email);
        verifyData_js_1.Verify.checkIndex(res.index, "Invalid email", res, next);
    }
    //Middleware verifies old pass and updates to new pass
    static updatePwd(req, res) {
        const changeLog = filterData_js_1.FilterData.getChangeLogs();
        const change = UpdateModule.createChangeLog(res.employees[res.index], changeLog);
        if (!UpdateModule.bcrypt.compareSync(req.body.oldPassword, res.employees[res.index].password)) {
            res.send("Old password incorrect");
        }
        else {
            UpdateModule.bcrypt.hash(req.body.password, 5).then((hash) => {
                change.before.password = res.employees[res.index].password;
                change.after.password = hash;
                res.employees[res.index].password = hash;
                change.updatedAt = Date.now();
                changeLog.push(change);
                UpdateModule.fs.writeFileSync(UpdateModule.changepath, JSON.stringify(changeLog));
                UpdateModule.fs.writeFileSync(UpdateModule.datapath, JSON.stringify(res.employees));
                res.send("Password updated successfully");
            });
        }
    }
}
exports.UpdateModule = UpdateModule;
UpdateModule.fs = require("fs");
UpdateModule.path = require("path");
UpdateModule.changepath = UpdateModule.path.join(__dirname, "../DATA/changeLog.json");
UpdateModule.datapath = UpdateModule.path.join(__dirname, "../DATA/data.json");
UpdateModule.bcrypt = require("bcrypt");
// Updatemodule.exports = UpdateModule;
