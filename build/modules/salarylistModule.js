"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalaryModule = void 0;
const filterData_1 = require("./filterData");
class SalaryModule {
    //returns max of key in array 'a'
    static findMax(a, key) {
        let max = 0;
        a.map((e) => {
            if (e[key] > max)
                max = e[key];
        });
        return max;
    }
    //returns min of key in array 'a'
    static findMin(a, key) {
        let min = Infinity;
        a.map((e) => {
            if (e[key] < min)
                min = e[key];
        });
        return min;
    }
    // Middleware sends csv as attachment
    static downloadReport(req, res) {
        const emp = filterData_1.FilterData.getEmp();
        const deptObj = {};
        emp.map(e => {
            deptObj[e.department] = [];
        });
        emp.map(e => {
            deptObj[e.department].push(e.salary);
        });
        const output = [];
        Object.keys(deptObj).forEach(key => {
            const avg = filterData_1.FilterData.arrAverage(deptObj[key]);
            output.push({ department: key, totalSalaryExpenditure: avg[0], deptAvg: avg[1].toFixed(2) });
        });
        const csvData = SalaryModule.csvjson.toCSV(JSON.stringify(output), { headers: 'key' });
        SalaryModule.fs.writeFile(SalaryModule.writepath, csvData, (err) => {
            if (err) {
                console.log(err);
                res.end('Could not generate file');
            }
            else {
                res.download(SalaryModule.writepath);
            }
        });
    }
    //sends top n employees by salary
    static getTop(req, res) {
        let i = 0;
        if (typeof req.query.number === 'string') {
            i = parseInt(req.query.number);
        }
        else {
            i = 3;
        }
        const emp = filterData_1.FilterData.getEmp();
        if (!i) {
            i = 1;
        }
        else if (i > emp.length) {
            i = emp.length;
        }
        filterData_1.FilterData.sortby(emp, 'salary', -1);
        while (i < emp.length && emp[i].salary === emp[i - 1].salary) {
            i++;
        }
        res.send(emp.slice(0, i));
    }
    //sends total and average salaries to be distributed
    static getAvg(req, res) {
        const emp = filterData_1.FilterData.getEmp();
        const avg = filterData_1.FilterData.objAverage(emp, 'salary');
        res.send(`Total Salary to be distributed: $${avg[0]}\nAverage employee salary: $` + avg[1].toFixed(2));
    }
    //sends avg salary of all depts
    static getDeptAvg(req, res) {
        const emp = filterData_1.FilterData.getEmp();
        const deptObj = {};
        emp.map(e => {
            deptObj[e.department] = [];
        });
        emp.map(e => {
            deptObj[e.department].push(e.salary);
        });
        const output = [];
        Object.keys(deptObj).forEach(key => {
            const avg = filterData_1.FilterData.arrAverage(deptObj[key]);
            output.push({ department: key, average: avg[1].toFixed(2) });
        });
        res.send('Department wise average salary:' + JSON.stringify(output));
    }
    //sends avg sal of specified dept
    static getAvgByDept(req, res) {
        if (typeof req.query.name === 'string') {
            const dept = req.query.name;
            const emp = filterData_1.FilterData.getEmp();
            const deptList = filterData_1.FilterData.filterDept(emp, dept);
            const avg = filterData_1.FilterData.objAverage(deptList, 'salary');
            res.send(`Average salary in ${dept} department is $${avg[1].toFixed(2)}`);
        }
        else {
            res.send('provide deptname');
        }
    }
    //sends max and min sal of specified dept
    static getDeptMaxMin(req, res) {
        if (typeof req.query.name === 'string') {
            const dept = req.query.name;
            const emp = filterData_1.FilterData.getEmp();
            const filterArr = filterData_1.FilterData.filterDept(emp, dept);
            const max = SalaryModule.findMax(filterArr, 'salary');
            const min = SalaryModule.findMin(filterArr, 'salary');
            res.send(`Max sal:${max}\nMin sal:${min}`);
        }
        else {
            res.send('Provide deptname');
        }
    }
}
exports.SalaryModule = SalaryModule;
SalaryModule.path = require('path');
SalaryModule.fs = require('fs');
SalaryModule.csvjson = require('csvjson');
SalaryModule.writepath = SalaryModule.path.join(__dirname, '/DATA/report.csv');
