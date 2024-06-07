const { filterDept, objAverage, arrAverage, sortby, getEmp } = require('../modules/filterData');

class Module {
    static path = require('path');
    static fs = require('fs');
    static csvjson = require('csvjson');
    static writepath = Module.path.join(__dirname, '/DATA/report.csv');

    //returns max of key in array 'a'
    static findMax(a, key) {
        let max = 0;
        a.map((e) => {
            if (e[key] > max) max = e[key];
        })
        return max;
    }

    //returns min of key in array 'a'
    static findMin(a, key) {
        let min = Infinity;
        a.map((e) => {
            if (e[key] < min) min = e[key];
        })
        return min;
    }

    // Middleware sends csv as attachment
    static downloadReport(req, res) {
        const emp = getEmp();
        const deptObj = {};
        emp.map(e => {
            deptObj[e.department] = [];
        });
        emp.map(e => {
            deptObj[e.department].push(e.salary);
        });
        const output = [];
        Object.keys(deptObj).forEach(key => {
            const avg = arrAverage(deptObj[key]);
            output.push({ department: key, totalSalaryExpenditure: avg[0], deptAvg: avg[1].toFixed(2) });
        });
        const csvData = Module.csvjson.toCSV(JSON.stringify(output), { headers: 'key' });

        Module.fs.writeFile(Module.writepath, csvData, (err) => {
            if (err) {
                console.log(err);
                res.end('Could not generate file');
            } else {
                res.download(Module.writepath);
            }
        });
    }

    //sends top n employees by salary
    static getTop(req, res) {
        let i = parseInt(req.query.number);
        const emp = getEmp();
        if (!i) { i = 1 }
        else if (i > emp.length) { i = emp.length }
        sortby(emp, 'salary', -1);
        while (i < emp.length && emp[i].salary === emp[i - 1].salary) { i++; console.log(i); }
        res.send(emp.slice(0, i));
    }

    //sends total and average salaries to be distributed
    static getAvg(req, res) {
        const emp = getEmp();
        const avg = objAverage(emp, 'salary');
        res.send(`Total Salary to be distributed: $${avg[0]}\nAverage employee salary: $` + avg[1].toFixed(2));
    }

    //sends avg salary of all depts
    static getDeptAvg(req, res) {
        const emp = getEmp();
        const deptObj = {};
        emp.map(e => {
            deptObj[e.department] = [];
        });
        emp.map(e => {
            deptObj[e.department].push(e.salary);
        });
        console.log(deptObj);
        const output = [];
        Object.keys(deptObj).forEach(key => {
            const avg = arrAverage(deptObj[key]);
            output.push({ department: key, average: avg[1].toFixed(2) });
        })
        res.send('Department wise average salary:' + JSON.stringify(output));
    }

    //sends avg sal of specified dept
    static getAvgByDept(req, res) {
        const dept = req.query.name;
        const emp = getEmp();
        const deptList = filterDept(emp, dept);
        const avg = objAverage(deptList, 'salary');
        res.send(`Average salary in ${dept} department is $${avg[1].toFixed(2)}`);
    }

    //sends max and min sal of specified dept
    static getDeptMaxMin(req, res) {
        const dept = req.query.name;
        const emp = getEmp();
        const a = filterDept(emp, dept);
        const max = Module.findMax(a, 'salary');
        const min = Module.findMin(a, 'salary');
        res.send(`Max sal:${max}\nMin sal:${min}`);
    }
}
module.exports = Module;