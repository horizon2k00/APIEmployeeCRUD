// const { filterDept, objAverage, arrAverage, sortby, getEmp } = require('../modules/filterData');
import { FilterData } from "./filterData";

interface employee {
    [index:string]:number|string;
    empId:number;
    name: string;
    position: string;
    department:string;
    salary:number;
    email:string;
    password:string;
    age:number;
    privilege:string;
    joinDate:string;
    rating:number;
}

type numberKey = 'salary' | 'empId' | 'age' | 'rating'

export class SalaryModule {
    static path = require('path');
    static fs = require('fs');
    static csvjson = require('csvjson');
    static writepath = SalaryModule.path.join(__dirname, '/DATA/report.csv');

    //returns max of key in array 'a'
    static findMax(a:employee[], key:numberKey) {
        let max = 0;
        a.map((e) => {
            if (e[key] > max) max = e[key];
        })
        return max;
    }

    //returns min of key in array 'a'
    static findMin(a:employee[], key:numberKey) {
        let min = Infinity;
        a.map((e) => {
            if (e[key] < min) min = e[key];
        })
        return min;
    }

    // Middleware sends csv as attachment
    static downloadReport(req: any, res: { end: (arg0: string) => void; download: (arg0: any) => void; }) {
        const emp = FilterData.getEmp();
        const deptObj:{[index:string]:number[]} = {};
        emp.map(e => {
            deptObj[e.department] = [];
        });
        emp.map(e => {
            deptObj[e.department].push(e.salary);
        });
        const output:{}[] = [];
        Object.keys(deptObj).forEach(key => {
            const avg = FilterData.arrAverage(deptObj[key]);
            output.push({ department: key, totalSalaryExpenditure: avg[0], deptAvg: avg[1].toFixed(2) });
        });
        const csvData = SalaryModule.csvjson.toCSV(JSON.stringify(output), { headers: 'key' });

        SalaryModule.fs.writeFile(SalaryModule.writepath, csvData, (err:any) => {
            if (err) {
                console.log(err);
                res.end('Could not generate file');
            } else {
                res.download(SalaryModule.writepath);
            }
        });
    }

    //sends top n employees by salary
    static getTop(req: { query: { number: string; }; }, res:{send: (arg0: any) => void; }) {
        let i = parseInt(req.query.number);
        const emp = FilterData.getEmp();
        if (!i) { i = 1 }
        else if (i > emp.length) { i = emp.length }
        FilterData.sortby(emp, 'salary', -1);
        while (i < emp.length && emp[i].salary === emp[i - 1].salary) { i++; console.log(i); }
        res.send(emp.slice(0, i));
    }

    //sends total and average salaries to be distributed
    static getAvg(req: any, res: { send: (arg0: string) => void; }) {
        const emp = FilterData.getEmp();
        const avg = FilterData.objAverage(emp, 'salary');
        res.send(`Total Salary to be distributed: $${avg[0]}\nAverage employee salary: $` + avg[1].toFixed(2));
    }

    //sends avg salary of all depts
    static getDeptAvg(req: any, res: { send: (arg0: string) => void; }) {
        const emp = FilterData.getEmp();
        const deptObj:{[index:string]:number[]} = {};
        emp.map(e => {
            deptObj[e.department] = [];
        });
        emp.map(e => {
            deptObj[e.department].push(e.salary);
        });
        console.log(deptObj);
        const output:{}[] = [];
        Object.keys(deptObj).forEach(key => {
            const avg = FilterData.arrAverage(deptObj[key]);
            output.push({ department: key, average: avg[1].toFixed(2) });
        })
        res.send('Department wise average salary:' + JSON.stringify(output));
    }

    //sends avg sal of specified dept
    static getAvgByDept(req: { query: { name: any; }; }, res: { send: (arg0: string) => void; }) {
        const dept = req.query.name;
        const emp = FilterData.getEmp();
        const deptList = FilterData.filterDept(emp, dept);
        const avg = FilterData.objAverage(deptList, 'salary');
        res.send(`Average salary in ${dept} department is $${avg[1].toFixed(2)}`);
    }

    //sends max and min sal of specified dept
    static getDeptMaxMin(req: { query: { name: any; }; }, res: { send: (arg0: string) => void; }) {
        const dept = req.query.name;
        const emp = FilterData.getEmp();
        const a = FilterData.filterDept(emp, dept);
        const max = SalaryModule.findMax(a, 'salary');
        const min = SalaryModule.findMin(a, 'salary');
        res.send(`Max sal:${max}\nMin sal:${min}`);
    }
}
// module.exports = Module;