(req, res) => {
    const employees = getEmp();
    const changeLog = getChangeLogs();
    const ids = req.body;
    const inc = parseInt(req.query.inc);
    const updatedList = [];
    employees.map(emp => {
        ids.map(id => {
            if (emp.empId === id) {
                const change = createChangeLog(emp, changeLog);
                change.before.age = emp.age;
                emp.age += increment;
                change.after.age = emp.age;
                change.updatedAt = Date.now();
                changeLog.push(change);
                updatedList.push({ empId: emp.empId, name: emp.name, email: emp.email, age: emp.age });
            }
        });
    });
    if (updatedList.length) {
        fs.writeFileSync(datapath, JSON.stringify(employees));
        fs.writeFileSync(changepath, JSON.stringify(changeLog));
        res.send(updatedList);
    } else {
        res.send('Employees with these ids do not exist')
    }
}
(req, res) => {
    const employees = getEmp();
    const changeLog = getChangeLogs();
    const ids = req.body;
    const inc = parseInt(req.query.inc);
    const updatedList = [];
    employees.map(emp => {
        ids.map(id => {
            if (emp.empId === id) {
                const change = createChangeLog(emp, changeLog);
                change.before.rating = emp.rating;
                emp.rating += inc;
                if (emp.rating < 0) {
                    emp.rating = 0
                } if (emp.rating > 5) {
                    emp.rating = 5;
                }
                change.after.rating = emp.rating;
                change.updatedAt = Date.now();
                changeLog.push(change);
                updatedList.push({ empId: emp.empId, name: emp.name, email: emp.email, rating: emp.rating.toFixed(1) });
            }
        });
    });
    if (updatedList.length) {
        fs.writeFileSync(datapath, JSON.stringify(employees));
        fs.writeFileSync(changepath, JSON.stringify(changeLog));
        res.send(updatedList);
    } else {
        res.send('Employees with these ids do not exist')
    }
}
function bulkUpdate(req, res) {
    param = req.route.path.slice(1,2);
    bulkUpdate(req,res,param); 
}
function bulkUpdate(req,res,arg){
    const employees = getEmp();
    const changeLog = getChangeLogs();
    const ids = req.body;
    const inc = parseInt(req.query.inc);
    const updatedList = [];
    employees.map(emp => {
        ids.map(id => {
            if (emp.empId === id) {
                const change = createChangeLog(emp, changeLog);
                change.before[arg] = emp[arg];
                if(arg === 's'){
                    inc = emp[arg]*inc/100;
                }
                emp[arg] += inc;
                change.after[arg] = emp[arg];
                change.updatedAt = Date.now();
                changeLog.push(change);
                updatedList.push({ empId: emp.empId, name: emp.name, email: emp.email, salary: emp[arg].toFixed(2) });
            }
        });
    });
    if (updatedList.length) {
        fs.writeFileSync(datapath, JSON.stringify(employees));
        fs.writeFileSync(changepath, JSON.stringify(changeLog));
        res.send(updatedList);
    } else {
        res.send('Employees with these ids do not exist')
    }
}
