// const { authorizedUser, findEmp, checkIndex} = require('./verifyData.js');
import { Verify } from "./verifyData.js";
import { FilterData } from "./filterData.js";
import { employee, changeLog } from "./typeDefinitions.js";

export class UpdateModule {
  static fs = require("fs");
  static path = require("path");
  static changepath: string = UpdateModule.path.join(__dirname,"../DATA/changeLog.json");
  static datapath: string = UpdateModule.path.join(__dirname,"../DATA/data.json");
  static bcrypt = require("bcrypt");

  //Middleware driver to bulk update sal, age or rating

  static bulkUpdate(req: { route: { path: string } }, res: any) {
    const param: string = req.route.path.slice(1, 2);
    UpdateModule.argBulkUpdate(req, res, param);
  }
  //actual bulk update function

  static argBulkUpdate(
    req: { route?: { path: string }; body?: any; query?: any },
    res: { send: (arg0: string | any[]) => void },
    arg: string
  ) {
    if (arg === "s") {
      arg = "salary";
    } else if (arg === "r") {
      arg = "rating";
    } else if (arg === "a") {
      arg = "age";
    } else {
      res.send("path error");
    }
    const employees: employee[] = FilterData.getEmp();
    const changeLog = FilterData.getChangeLogs();
    const ids = req.body;
    let inc = parseInt(req.query.inc);
    interface update {
      empId: number;
      name: string;
      email: string;
      salary?: number;
      rating?: number;
      age?: number;
    }
    const updatedList: update[] = [];
    employees.map((emp: employee) => {
      ids.map((id: number) => {
        if (emp.empId === id) {
          const change: changeLog = UpdateModule.createChangeLog(
            emp,
            changeLog
          );
          change.before[arg] = emp[arg];
          if (arg === "salary") {
            inc = (emp[arg] * inc) / 100;
            emp[arg] += inc;
          } else if (arg === "rating") {
            emp[arg] += inc;
            if (emp[arg] > 5) {
              emp[arg] = 5;
            }
            if (emp[arg] < 0) {
              emp[arg] = 0;
            }
          } else if (arg === "age") {
            emp[arg] += inc;
          }
          change.after[arg] = emp[arg];
          change.updatedAt = Date.now();
          changeLog.push(change);
          updatedList.push({
            empId: emp.empId,
            name: emp.name,
            email: emp.email,
            [arg]: emp[arg],
          });
        }
      });
    });
    if (updatedList.length) {
      UpdateModule.fs.writeFileSync(
        UpdateModule.datapath,
        JSON.stringify(employees)
      );
      UpdateModule.fs.writeFileSync(
        UpdateModule.changepath,
        JSON.stringify(changeLog)
      );
      res.send(updatedList);
    } else {
      res.send("Employees with these ids do not exist");
    }
  }

  //employee update middleware.

  static update(
    req: {
      params: { id: string };
      body: {
        email: any;
        name: any;
        age: any;
        position: any;
        department: any;
        salary: any;
        privilege: any;
        rating: any;
      };
    },
    res: { index: number; send: (arg0: string) => void }
  ) {
    const emp = FilterData.getEmp();
    const changeLog = FilterData.getChangeLogs();
    let change: changeLog = {
      id: undefined,
      empId: parseInt(req.params.id),
      createdAt: Date.now(),
      before: {},
      after: {},
      updatedAt: undefined,
    };
    change.empId = parseInt(req.params.id);
    change.createdAt = Date.now();
    if (changeLog.length === 0) {
      change.id = 1;
    } else {
      change.id = changeLog[changeLog.length - 1].id + 1;
    }
    if (req.body.email) {
      const index = Verify.findEmp(emp, "email", req.body.email);
      if (index !== res.index && index !== -1) {
        res.send("This email is already in use for a different user");
      } else {
        change.before.email = emp[res.index].email;
        change.after.email = req.body.email;
        emp[res.index].email = req.body.email;
      }
    }
    if (req.body.name) {
      change.before.name = emp[res.index].name;
      change.after.name = req.body.name;
      emp[res.index].name = req.body.name;
    }
    if (req.body.age) {
      change.before.age = emp[res.index].age;
      change.after.age = req.body.age;
      emp[res.index].age = req.body.age;
    }
    if (req.body.position) {
      change.before.position = emp[res.index].position;
      change.after.position = req.body.position;
      emp[res.index].position = req.body.position;
    }
    if (req.body.department) {
      change.before.department = emp[res.index].department;
      change.after.department = req.body.department;
      emp[res.index].department = req.body.department;
    }
    if (req.body.salary) {
      change.before.salary = emp[res.index].salary;
      change.after.salary = req.body.salary;
      emp[res.index].salary = req.body.salary;
    }
    if (req.body.privilege) {
      change.before.privilege = emp[res.index].privilege;
      change.after.privilege = req.body.privilege;
      emp[res.index].privilege = req.body.privilege;
    }
    if (req.body.rating) {
      change.before.rating = emp[res.index].rating;
      change.after.rating = req.body.rating;
      emp[res.index].rating = req.body.rating;
    }
    change.updatedAt = Date.now();
    changeLog.push(change);
    UpdateModule.fs.writeFileSync(UpdateModule.datapath, JSON.stringify(emp));
    UpdateModule.fs.writeFileSync(
      UpdateModule.changepath,
      JSON.stringify(changeLog)
    );
    res.send(
      `employee details updated: \n` +
        `${JSON.stringify(emp[res.index])}\nChangelog:${JSON.stringify(change)}`
    );
  }

  // gets index of emp with given id-stores in res.index

  static setRoute(req: any, res: { updateRoute: boolean }, next: () => void) {
    res.updateRoute = true;
    next();
  }

  //verify person trying to update pwd    --req.body.email === req.jwtPayload.email-- next() if true, error res if false

  static passAuth(
    req: { jwtPayload: any; body: any },
    res: { send: (arg0: string) => void },
    next: () => void
  ) {
    if (Verify.authorizedUser(req.jwtPayload, req.body, "personal")) {
      next();
    } else {
      res.send(
        "Incorrect email or you are trying to update an id that is not yours"
      );
    }
  }

  //check if user is updating their own data, if not checks if admin. sends error response if both false

  static authorizeUser(
    req: { jwtPayload: any },
    res: { index: number; send: (arg0: string) => void },
    next: () => void
  ) {
    const employees = FilterData.getEmp();
    if (Verify.authorizedUser(req.jwtPayload, employees[res.index])) {
      next();
    } else {
      res.send("You dont have access to update this information");
    }
  }

  //function to create new changelog obj -- returns changeLog obj

  static createChangeLog(emp: employee, changeLog: string | any[]) {
    let id: number;
    if (changeLog.length === 0) {
      id = 1;
    } else {
      id = changeLog[changeLog.length - 1].id + 1;
    }
    const change: changeLog = {
      id,
      empId: emp.empId,
      createdAt: Date.now(),
      before: {},
      after: {},
      updatedAt: undefined,
    };
    return change;
  }

  //Middleware to check if wmp with requested email exists
  static verifyIndexByEmail(
    req: { body: { email: any } },
    res: { employees: employee[]; index: number },
    next: any
  ) {
    res.employees = FilterData.getEmp();
    res.index = Verify.findEmp(res.employees, "email", req.body.email);
    Verify.checkIndex(res.index, "Invalid email", res, next);
  }

  //Middleware verifies old pass and updates to new pass

  static updatePwd(
    req: { body: { oldPassword: any; password: any } },
    res: { employees: employee[]; index: number; send: (arg0: string) => void }
  ) {
    const changeLog = FilterData.getChangeLogs();
    const change = UpdateModule.createChangeLog(
      res.employees[res.index],
      changeLog
    );
    if (
      !UpdateModule.bcrypt.compareSync(
        req.body.oldPassword,
        res.employees[res.index].password
      )
    ) {
      res.send("Old password incorrect");
    } else {
      UpdateModule.bcrypt.hash(req.body.password, 5).then((hash: string) => {
        change.before.password = res.employees[res.index].password;
        change.after.password = hash;
        res.employees[res.index].password = hash;
        change.updatedAt = Date.now();
        changeLog.push(change);
        UpdateModule.fs.writeFileSync(
          UpdateModule.changepath,
          JSON.stringify(changeLog)
        );
        UpdateModule.fs.writeFileSync(
          UpdateModule.datapath,
          JSON.stringify(res.employees)
        );
        res.send("Password updated successfully");
      });
    }
  }
}

// Updatemodule.exports = UpdateModule;
