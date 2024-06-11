import {FilterData} from  './filterData.js';
// const {getEmp} = require('./filterData.js');
import { Verify } from './verifyData.js';

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

export class CreateModule {
    
    static fs = require('fs');
    static path = require('path');
    static datapath = CreateModule.path.join(__dirname, '../DATA/data.json');
    static bcrypt = require('bcrypt');

    static exists(req: any, res: any, next: () => void) {
        if (!CreateModule.fs.existsSync(CreateModule.datapath)) {
            CreateModule.fs.writeFileSync(CreateModule.datapath, '[]');
        }
        next();
    }

    //creates new employee object with given details and adds to employee data file
    static createEntry(req: { body: employee }, res: { send: (arg0: string) => void; }) {
        const employees:employee[] = FilterData.getEmp();
        const index = Verify.findEmp(employees, 'email', req.body.email);
        req.body.joinDate = Date().slice(4, 15);  
        req.body.rating = 3;
        if (index === -1) {
            if (employees.length === 0) {
                req.body.id = 1;
            } else {
                req.body.empId = employees[employees.length - 1].empId + 1;
            }
            CreateModule.bcrypt.hash(req.body.password, 5).then((hash: any) => {
                req.body.password = hash;
                employees.push(req.body);
                CreateModule.fs.writeFileSync(CreateModule.datapath, JSON.stringify(employees));
                res.send('Employee added sucessfully');
            });
        } else {
            res.send('This email is in use');
        }
    }
}
// Createmodule.exports = CreateModule;