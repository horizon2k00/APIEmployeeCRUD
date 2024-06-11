"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadModule = void 0;
const verifyData_js_1 = require("./verifyData.js");
const filterData_js_1 = require("./filterData.js");
class ReadModule {
    //Middleware sends emp details if authorized
    static getId(req, res) {
        const emp = res.employees[res.index];
        if (verifyData_js_1.Verify.authorizedUser(req.jwtPayload, emp))
            res.send(`Employee id ${res.id} \n ${JSON.stringify(emp)}`);
        else
            res.send('Access Denied');
    }
    //Middleware sends count of emp in specified dept
    static getDeptCount(req, res) {
        const employees = filterData_js_1.FilterData.getEmp();
        const dept = req.query.name;
        const a = filterData_js_1.FilterData.filterDept(employees, dept);
        res.send(`Total employee count in the ${dept} department: ${a.length}`);
    }
    //Middleware gets update history of specified id if authorized
    static getIdHistory(req, res) {
        const changeLog = filterData_js_1.FilterData.getChangeLogs();
        if (verifyData_js_1.Verify.authorizedUser(req.jwtPayload, res.employees[res.index])) {
            const empLog = changeLog.filter(e => e.empId === res.id);
            empLog.sort((a, b) => b.updatedAt - a.updatedAt);
            let updNo = empLog.length;
            const empHist = res.employees[res.index];
            empLog.map(ele => {
                const { updatedAt, after, before } = ele;
                const dateObj = new Date(updatedAt);
                const date = dateObj.toString();
                empHist[`changeLog ${updNo--}`] = { updatedAt: date, after, before };
            });
            res.send(`Data History:\n${JSON.stringify(empHist)}`);
        }
        else {
            res.send('Access denied');
        }
    }
    //Middleware sends count of employees
    static getTotalCount(req, res) {
        const employees = filterData_js_1.FilterData.getEmp();
        res.send(`Total employee count in the company: ${employees.length}`);
    }
    //Middleware sends paginated emp with rating less than specified number
    static getEmpLtRating(req, res) {
        const employees = filterData_js_1.FilterData.getEmp();
        const rating = req.query.rating;
        const list = employees.filter(ele => ele.rating <= rating);
        filterData_js_1.FilterData.sortby(list, 'rating', 1);
        const returnList = filterData_js_1.FilterData.paginate(list, req.query.page, req.query.limit);
        res.send(`Employees with rating above ${rating}:` + JSON.stringify(returnList));
    }
    //Middleware sends paginated emp with rating greater than specified number
    static getEmpGtRating(req, res) {
        const employees = filterData_js_1.FilterData.getEmp();
        const rating = req.query.rating;
        const list = employees.filter(ele => ele.rating >= rating);
        filterData_js_1.FilterData.sortby(list, 'rating', -1);
        const returnList = filterData_js_1.FilterData.paginate(list, req.query.page, req.query.limit);
        res.send(`Employees with rating above ${rating}:` + JSON.stringify(returnList));
    }
    //Middleware sends paginated list of emp in specified dept
    static getEmpByDept(req, res) {
        const dept = req.query.name;
        const employees = filterData_js_1.FilterData.getEmp();
        const list = filterData_js_1.FilterData.filterDept(employees, dept);
        const returnList = filterData_js_1.FilterData.paginate(list, req.query.page, req.query.limit);
        res.send(returnList);
    }
    //Middleware sends paginated emp list sorted by specified key
    static getEmpSorted(req, res) {
        const param = req.query.param;
        const order = parseInt(req.query.order);
        let employees = filterData_js_1.FilterData.getEmp();
        filterData_js_1.FilterData.sortby(employees, param, order);
        const returnList = filterData_js_1.FilterData.paginate(employees, req.query.page, req.query.limit);
        res.send(returnList);
    }
    //Middleware sends paginated list of emp if admin 
    static getEmpList(req, res) {
        const employees = filterData_js_1.FilterData.getEmp();
        if (employees.length === 0) {
            res.send('no employee present in company');
        }
        else {
            const returnList = filterData_js_1.FilterData.paginate(employees, req.query.page, req.query.limit);
            res.send(JSON.stringify(returnList));
        }
    }
}
exports.ReadModule = ReadModule;
