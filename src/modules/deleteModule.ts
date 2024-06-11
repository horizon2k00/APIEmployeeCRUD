import {FilterData} from  './filterData.js';
// const { getEmp } = require('../modules/filterData.js');

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

export class DeleteModule {
    static fs = require('fs');
    static path = require('path');
    static datapath:string = DeleteModule.path.join(__dirname, '../DATA/data.json');

    static deleteAll(req: any, res: { send: (arg0: string) => void; }) {
            const employees = FilterData.getEmp();
            employees.splice(0, employees.length);
            DeleteModule.fs.writeFileSync(DeleteModule.datapath, JSON.stringify(employees));
            res.send(`All employees deleted`);
    }
    
    static deleteId(req: any, res: { employees: employee[]; index: any; send: (arg0: string) => void; }) {
        res.employees.splice(res.index, 1);
        DeleteModule.fs.writeFileSync(DeleteModule.datapath, JSON.stringify(res.employees));
        res.send(`employee details deleted`);
    }
}
// module.exports = Module;