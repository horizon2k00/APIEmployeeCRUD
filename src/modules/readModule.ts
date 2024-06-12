import { Verify } from './verifyData.js';
import { FilterData } from './filterData.js'
import { employee, Request, Response, Res, Req, changeLog } from './typeDefinitions.js';
import { empHist } from './typeDefinitions.js';

export class ReadModule {

    //Middleware sends emp details if authorized
    static getId(req: Req, res: Res) {
        const emp: employee = res.employees[res.index];
        if (Verify.authorizedUser(req.jwtPayload, emp)) res.send(`Employee id ${res.id} \n ${JSON.stringify(emp)}`);
        else res.send('Access Denied');
    }

    //Middleware sends count of emp in specified dept
    static getDeptCount(req: Request, res: Response) {
        const employees: employee[] = FilterData.getEmp();
        if (typeof req.query.name === 'string') {
            const dept: string = req.query.name;
            const filterArr: employee[] = FilterData.filterDept(employees, dept);
            res.send(`Total employee count in the ${dept} department: ${filterArr.length}`);
        } else {
            res.send('Error, specify department');
        }
    }

    //Middleware gets update history of specified id if authorized
    static getIdHistory(req: Req, res: Res) {
        const changeLog: changeLog[] = FilterData.getChangeLogs();
        if (Verify.authorizedUser(req.jwtPayload, res.employees[res.index])) {
            const empLog: changeLog[] = changeLog.filter(e => e.empId === res.id);
            empLog.sort((a, b) => b.updatedAt - a.updatedAt);
            const empHist: empHist = res.employees[res.index];
            empHist.history = [];
            empLog.map(ele => {
                const { updatedAt, after, before } = ele;
                const dateObj:Date = new Date(updatedAt);
                const date:string = dateObj.toString();
                if (empHist.history) {
                    empHist.history.push({ updatedAt: date, after, before });
                }
            });
            res.send(`Data History:\n${JSON.stringify(empHist)}`);
        } else {
            res.send('Access denied');
        }
    }

    //Middleware sends count of employees
    static getTotalCount(req: Request, res: Response) {
        const employees:employee[] = FilterData.getEmp();
        res.send(`Total employee count in the company: ${employees.length}`);
    }

    //Middleware sends paginated emp with rating less than specified number
    static getEmpLtRating(req: Request, res: Response) {
        const employees:employee[] = FilterData.getEmp();
        if (typeof req.query.rating === 'string' && typeof req.query.page === 'string' && typeof req.query.limit === 'string') {
            const rating = parseInt(req.query.rating);
            const list:employee[] = employees.filter(ele => ele.rating <= rating);
            FilterData.sortby(list, 'rating', 1);
            const returnList:employee[] = FilterData.paginate(list, req.query.page, req.query.limit);
            res.send(`Employees with rating below ${rating}:` + JSON.stringify(returnList));
        } else {
            res.send('provide all details')
        }
    }


    //Middleware sends paginated emp with rating greater than specified number
    static getEmpGtRating(req: Request, res: Response) {
        const employees:employee[] = FilterData.getEmp();
        if (typeof req.query.rating === 'string' && typeof req.query.page === 'string' && typeof req.query.limit === 'string') {
            const rating = parseInt(req.query.rating);
            const list:employee[] = employees.filter(ele => ele.rating >= rating);
            FilterData.sortby(list, 'rating', -1);
            const returnList:employee[] = FilterData.paginate(list, req.query.page, req.query.limit);
            res.send(`Employees with rating above ${rating}:` + JSON.stringify(returnList));
        } else {
            res.send('provide all details')
        }
    }

    //Middleware sends paginated list of emp in specified dept
    static getEmpByDept(req: Request, res: Response) {
        if (typeof req.query.name === 'string' && typeof req.query.page === 'string' && typeof req.query.limit === 'string') {
            const dept:string = req.query.name;
            const employees:employee[] = FilterData.getEmp();
            const list:employee[] = FilterData.filterDept(employees, dept);
            const returnList:employee[] = FilterData.paginate(list, req.query.page, req.query.limit);
            res.send(returnList);
        } else {
            res.send('provide all details')
        }
    }

    //Middleware sends paginated emp list sorted by specified key
    static getEmpSorted(req: Request, res: Response) {
        if (typeof req.query.param === 'string' && typeof req.query.order === 'string' && typeof req.query.limit === 'string' && typeof req.query.page === 'string') {
            const param:string = req.query.param;
            const order:number = parseInt(req.query.order);
            let employees:employee[] = FilterData.getEmp();
            FilterData.sortby(employees, param, order);
            const returnList:employee[] = FilterData.paginate(employees, req.query.page, req.query.limit);
            res.send(returnList);
        } else {
            res.send('provide all details')
        }
    }

    //Middleware sends paginated list of emp if admin 
    static getEmpList(req: Request, res: Response) {
        const employees:employee[] = FilterData.getEmp();
        if (employees.length === 0) {
            res.send('no employee present in company');
        } else {
            if (typeof req.query.limit === 'string' && typeof req.query.page === 'string') {
                const returnList:employee[] = FilterData.paginate(employees, req.query.page, req.query.limit);
                res.send(JSON.stringify(returnList));
            } else {
                res.send('provide all details')
            }
        }
    }
}
