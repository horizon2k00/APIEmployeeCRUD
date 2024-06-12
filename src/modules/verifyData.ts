import { NextFunction, Payload, Req, Request, Res, Response, employee } from './typeDefinitions';
import {FilterData} from './filterData.js';

// any data sent to this module needs to be saved to req.body or req object

export class Verify {

    static fs = require('fs');
    static path = require('path');
    static jwt = require('jsonwebtoken');
    static datapath = Verify.path.join(__dirname, '../DATA/data.json');

    // Middleware to check if employee datafile exists
    static exists(req: Request, res: Response, next: NextFunction):void {
        if (!Verify.fs.existsSync(Verify.datapath)) {
            res.send('no employee present in company');
        } else {
            next();
        }
    }

    //Middleware Authorizes jwt token and saves payload into req.payload(useful to check email and access privileges)
    static jwtAuth(req: Req, res: Response, next: NextFunction):void {
        try {
            if(typeof process.env.SECRET_KEY === 'string'){
                const secret:string = process.env.SECRET_KEY;
                req.jwtPayload = Verify.jwt.verify(req.get('Authorization'), secret);
                next();
            }else{
                throw new Error('environment variable missing, no secret key');
            }
        } catch (err) {
            console.log(' ' + err);
            res.send('Your token is invalid');
        }
    }

    // Normal static returns boolean based on jwt payload's 'privilege' key
    static isAdmin(req: Req): boolean {
        return req.jwtPayload.privilege === 'admin';
    }

    // Normal static (arg1, arg2, arg3||undefined), if arg3(can be 'admin' or 'personal'), checks if admin or if arg1.email === arg2.email else checks if either are true
    static authorizedUser(payload: Payload, empData: employee, specifyAuth?: string | number): boolean { //needs (req.payload, req.body)
        if (!specifyAuth) {
            specifyAuth = 1;
        }
        if (payload.privilege === 'admin' && empData.email === payload.email) {
            return true;
        } else if (payload.privilege === 'admin') {
            if (specifyAuth === 1) return true;
            else if (specifyAuth === 'admin') return true;
            else return false;
        } else if (empData.email === payload.email) {
            if (specifyAuth === 1) return true;
            else if (specifyAuth === 'personal') return true;
            else return false;
        } else return false;
    }

    // finds index of emp whose key:parameter matches "arg2":"arg3". Uses Arrays.findIndex()
    static findEmp(emp: employee[], key: string, parameter: string|number):number {
        const index:number = emp.findIndex((e) => e[key] === parameter)
        return index;
    }

    static verifyIndex(req: Request,res: Res, next: NextFunction){
        res.id = parseInt(req.params.id);
        res.employees = FilterData.getEmp();
        res.index = Verify.findEmp(res.employees, 'empId', res.id);
        Verify.checkIndex(res.index, "Employee doesn't exist", res, next);
    }
    
    //checkIndex(arg1,arg2,arg3) checks for index === -1 and sends err response 'arg2' if true, else next();
    static checkIndex(i: number, returnMsg: string, res: Res, next: NextFunction) {
        if (i !== -1) next();
        else {
            res.send(returnMsg);
        }
    }

    // Middleware verifies jwt for admin privilege
    static checkAdmin(req: Req, res: Response, next: NextFunction) {
        if (Verify.isAdmin(req)) {
            next();
        } else {
            res.send('Access privilege not granted. Required level-Admin');
        }
    }

    //Middleware verifies name
    static verifyName(req: Request, res: Res, next: NextFunction) {
        if (!req.body.name) {
            if (res.updateRoute) {
                next();
            } else {
                res.send('Please enter name');
            }
        } else if (req.body.name.charAt(0) <= 57) {
            res.send('name must start with a letter');
        } else {
            next();
        }
    }

    //Middleware verifies age
    static verifyAge(req: Request, res: Res, next: NextFunction) {
        if (!req.body.age) {
            if (res.updateRoute) {
                next();
            } else {
                res.send('Please enter age');
            }
        } else if (typeof (req.body.age) !== 'number') {
            res.send('age has to be a number');
        } else if (req.body.age < 18 || req.body.age > 60) {
            res.send('Age must be between 18 and 60 only')
        } else {
            next();
        }
    }

    //Middleware verifies password (uses regex matching)
    static verifyPass(req: Request, res: Res, next: NextFunction) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,30}$/;
        const pass:string = req.body.password;
        if (!pass) {
            if (res.updateRoute) {
                next();
            } else {
                res.send('Please enter a password');
            }
        } else if (pass.length < 8) {
            res.send('password must be at least 8 characters long');
        } else if (!regex.test(pass)) {
            res.send('Password must contain at least one caps, one number, and one special character');
        } else {
            next();
        }
    }

    //Middleware verifies email(uses basic regex matching, true verification must be done by sending email and awaiting response at server)
    static verifyEmail(req: Request, res: Res, next: NextFunction) {
        const regex = /\S+@\S+\.\S+/;
        if (!req.body.email) {
            if (res.updateRoute) {
                next();
            } else {
                res.send('Email not provided');
            }
        } else if (!regex.test(req.body.email)) {
            res.send('Email is not valid');
        } else {
            next();
        }
    }

    //Middleware verifies salary
    static verifySal(req: Request, res: Res, next: NextFunction) {
        if (!req.body.salary) {
            if (res.updateRoute) {
                next();
            } else {
                res.send('Please specify a salary');
            }
        } else if (typeof (req.body.salary) !== 'number') {
            res.send('salary must be a number');
        } else {
            next();
        }
    }

    //Middleware verifies department
    static verifyDep(req: Request, res: Res, next: NextFunction) {
        if (!req.body.department) {
            if (res.updateRoute) {
                next();
            } else {
                res.send('Choose one of the departments - Frontend, Backend or Fullstack');
            }
        } else if (req.body.department === 'Frontend' || req.body.department === 'Backend' || req.body.department === 'Fullstack') {
            next();
        } else {
            res.send("Choose one of the departments - Frontend, Backend or Fullstack");
        }
    }

    //Middleware verifies position
    static verifyPos(req: Request, res: Res, next: NextFunction) {
        if (!req.body.position) {
            if (res.updateRoute) {
                next();
            } else {
                res.send('Choose one of the departments - Frontend, Backend or Fullstack');
            }
        } else if (req.body.position === 'Intern' || req.body.position === 'Developer' || req.body.position === 'Tester' || req.body.position === 'QA') {
            next();
        } else {
            res.send("Choose one of the positions - Intern, Developer, Tester or QA");
        }
    }

    //Middleware verifies access privilege
    static verifyPriv(req: Request, res:Res, next: NextFunction) {
        if (!req.body.privilege) {
            if (res.updateRoute) {
                next();
            } else {
                res.send("Specify user's access privileges - 'admin' or 'emp'");
            }
        } else if (req.body.privilege === 'admin' || req.body.privilege === 'emp') {
            next();
        } else {
            res.send("Access privileges must be - 'admin' or 'emp'");
        }
    }

    //Middleware verifies employee rating
    static verifyRating(req: Request, res: Response, next: NextFunction) {
        if (!req.body.rating) {
            next();
        } else {
            if (req.body.rating < 0 || req.body.rating > 5) {
                res.send('Rating must be a decimal between 0 and 5');
            } else {
                next();
            }
        }
    }
}