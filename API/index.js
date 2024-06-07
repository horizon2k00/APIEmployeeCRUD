const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const { jwtAuth, exists, checkAdmin } = require('../modules/verifyData.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const fs = require('fs');
// const path = require('path');
// const datapath = path.join(__dirname,'/DATA/data.json');
// if(!fs.existsSync(datapath)){
//     fs.writeFileSync(datapath,'[]');}
//checks file exists and creates, not required anymore

const adminRead = require('./adminRead.js');
app.use('/emp', jwtAuth, exists, checkAdmin, adminRead);

const allRead = require('./allRead.js');
app.use('/emp/', jwtAuth, exists, allRead);

const bulkUpdate = require('./bulkUpdate.js');
app.use('/update/bulk', jwtAuth, exists, checkAdmin, bulkUpdate);

const empUpdate = require('./empUpdate.js');
app.use('/update', jwtAuth, exists, empUpdate);

const del = require('./delete.js');
app.use('/delete', jwtAuth, exists, checkAdmin, del);

const useCreate = require('./create.js');
app.use('/create', jwtAuth, checkAdmin, useCreate);

const useLogin = require('./login.js');
app.use('/login', exists, useLogin);

const salaryList = require('./topSalary.js');
app.use('/salarylist', jwtAuth, checkAdmin, exists, salaryList);

app.listen(port, () => {
    console.log(`listening to port ${port}`);
})