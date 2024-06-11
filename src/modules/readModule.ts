import { Verify } from './verifyData.js';
import {FilterData} from './filterData.js'

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

export class ReadModule {

    static getId(req: { jwtPayload: { privilege: string; email: any; }; }, res: { employees: { [x: string]: employee; }; index: string | number; send: (arg0: string) => void; id: any; }) {
        const emp:employee = res.employees[res.index];
        if (Verify.authorizedUser(req.jwtPayload, emp)) res.send(`Employee id ${res.id} \n ${JSON.stringify(emp)}`);
        else res.send('Access Denied');
    }
    static getDeptCount(req: { query: { name: string; }; }, res: { send: (arg0: string) => void; }) {
        const employees = FilterData.getEmp();
        const dept:string = req.query.name;
        const a = FilterData.filterDept(employees, dept);
        res.send(`Total employee count in the ${dept} department: ${a.length}`);
    }
    static getIdHistory(req: { jwtPayload: { privilege: string; email: any; }; }, res: { employees: { [x: string]: any; }; index: string | number; id: number; send: (arg0: string) => void; }) {
        const changeLog = FilterData.getChangeLogs();
        if (Verify.authorizedUser(req.jwtPayload, res.employees[res.index])) {
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
        } else {
            res.send('Access denied');
        }
    }
    static getTotalCount(req: any, res: { send: (arg0: string) => void; }) {
        const employees = FilterData.getEmp();
        res.send(`Total employee count in the company: ${employees.length}`);
    }
    static getEmpLtRating(req: { query: { rating: any; page: string; limit: string; }; }, res: { send: (arg0: string) => void; }) {
        const employees = FilterData.getEmp();
        const rating = req.query.rating;
        const list = employees.filter(ele => ele.rating <= rating);
        FilterData.sortby(list, 'rating', 1);
        const returnList = FilterData.paginate(list, req.query.page, req.query.limit);
        res.send(`Employees with rating above ${rating}:` + JSON.stringify(returnList));
    }
    static getEmpGtRating(req: { query: { rating: any; page: string; limit: string; }; }, res: { send: (arg0: string) => void; }) {
        const employees = FilterData.getEmp();
        const rating = req.query.rating;
        const list = employees.filter(ele => ele.rating >= rating);
        FilterData.sortby(list, 'rating', -1);
        const returnList = FilterData.paginate(list, req.query.page, req.query.limit);
        res.send(`Employees with rating above ${rating}:` + JSON.stringify(returnList));
    }
    static getEmpByDept(req: { query: { name: any; page: string; limit: string; }; }, res:{ send: (arg0: any) => void; }) {
        const dept = req.query.name;
        const employees = FilterData.getEmp();
        const list = FilterData.filterDept(employees, dept);
        const returnList = FilterData.paginate(list, req.query.page, req.query.limit);
        res.send(returnList);
    }
    static getEmpSorted(req: { query: { param: any; order: string; page: string; limit: string; }; }, res:{ send: (arg0: any) => void; }) {
        const param = req.query.param;
        const order = parseInt(req.query.order);
        let employees = FilterData.getEmp();
        FilterData.sortby(employees, param, order);
        const returnList = FilterData.paginate(employees, req.query.page, req.query.limit);
        res.send(returnList);
    }
    static getEmpList(req: { query: { page: string; limit: string; }; }, res:{ send: (arg0: any) => void; }) {
        const employees = FilterData.getEmp();
        if (employees.length === 0) {
            res.send('no employee present in company');
        } else {
            const returnList = FilterData.paginate(employees, req.query.page, req.query.limit);
            res.send(JSON.stringify(returnList));
        }
    }
}

// module.exports = Module;