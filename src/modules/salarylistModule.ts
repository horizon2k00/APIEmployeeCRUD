import { FilterData } from "./filterData";
import { employee, numberKey, Request, Response } from "./typeDefinitions";

export class SalaryModule {
    static path = require('path');
    static fs = require('fs');
    static csvjson = require('csvjson');
    static writepath = SalaryModule.path.join(__dirname, '/DATA/report.csv');

    //returns max of key in array 'a'
    static findMax(a: employee[], key: numberKey) {
        let max = 0;
        a.map((e) => {
            if (e[key] > max) max = e[key];
        })
        return max;
    }

    //returns min of key in array 'a'
    static findMin(a: employee[], key: numberKey) {
        let min = Infinity;
        a.map((e) => {
            if (e[key] < min) min = e[key];
        })
        return min;
    }

    // Middleware sends csv as attachment
    static downloadReport(req: Request, res: Response) {
        const emp: employee[] = FilterData.getEmp();
        const deptObj: { [index: string]: number[] } = {};
        emp.map(e => {
            deptObj[e.department] = [];
        });
        emp.map(e => {
            deptObj[e.department].push(e.salary);
        });
        const output: {}[] = [];
        Object.keys(deptObj).forEach(key => {
            const avg: number[] = FilterData.arrAverage(deptObj[key]);
            output.push({ department: key, totalSalaryExpenditure: avg[0], deptAvg: avg[1].toFixed(2) });
        });
        const csvData: string = SalaryModule.csvjson.toCSV(JSON.stringify(output), { headers: 'key' });

        SalaryModule.fs.writeFile(SalaryModule.writepath, csvData, (err: Error) => {
            if (err) {
                console.log(err);
                res.end('Could not generate file');
            } else {
                res.download(SalaryModule.writepath);
            }
        });
    }

    //sends top n employees by salary
    static getTop(req: Request, res: Response) {
        let i = 0;
        if (typeof req.query.number === 'string') {
            i = parseInt(req.query.number);
        } else {
            i = 3;
        }
        const emp = FilterData.getEmp();
        if (!i) { i = 1 }
        else if (i > emp.length) { i = emp.length }
        FilterData.sortby(emp, 'salary', -1);
        while (i < emp.length && emp[i].salary === emp[i - 1].salary) { i++; }
        res.send(emp.slice(0, i));
    }

    //sends total and average salaries to be distributed
    static getAvg(req: Request, res: Response) {
        const emp: employee[] = FilterData.getEmp();
        const avg: number[] = FilterData.objAverage(emp, 'salary');
        res.send(`Total Salary to be distributed: $${avg[0]}\nAverage employee salary: $` + avg[1].toFixed(2));
    }

    //sends avg salary of all depts
    static getDeptAvg(req: Request, res: Response) {
        const emp: employee[] = FilterData.getEmp();
        const deptObj: { [index: string]: number[] } = {};
        emp.map(e => {
            deptObj[e.department] = [];
        });
        emp.map(e => {
            deptObj[e.department].push(e.salary);
        });
        const output: {}[] = [];
        Object.keys(deptObj).forEach(key => {
            const avg: number[] = FilterData.arrAverage(deptObj[key]);
            output.push({ department: key, average: avg[1].toFixed(2) });
        })
        res.send('Department wise average salary:' + JSON.stringify(output));
    }

    //sends avg sal of specified dept
    static getAvgByDept(req: Request, res: Response) {
        if (typeof req.query.name === 'string') {
            const dept: string = req.query.name;
            const emp: employee[] = FilterData.getEmp();
            const deptList: employee[] = FilterData.filterDept(emp, dept);
            const avg: number[] = FilterData.objAverage(deptList, 'salary');
            res.send(`Average salary in ${dept} department is $${avg[1].toFixed(2)}`);
        } else {
            res.send('provide deptname')
        }
    }

    //sends max and min sal of specified dept
    static getDeptMaxMin(req: Request, res: Response) {
        if (typeof req.query.name === 'string') {
            const dept: string = req.query.name;
            const emp: employee[] = FilterData.getEmp();
            const filterArr: employee[] = FilterData.filterDept(emp, dept);
            const max: number = SalaryModule.findMax(filterArr, 'salary');
            const min: number = SalaryModule.findMin(filterArr, 'salary');
            res.send(`Max sal:${max}\nMin sal:${min}`);
        } else {
            res.send('Provide deptname');
        }
    }
}