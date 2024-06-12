import express from 'express';
const app = express();
const port = 3000;
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import { Verify } from '../modules/verifyData';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const adminRead = require('./adminRead.js');
app.use('/emp', Verify.jwtAuth, Verify.exists, Verify.checkAdmin, adminRead);

const allRead = require('./allRead.js');
app.use('/emp/', Verify.jwtAuth, Verify.exists, allRead);

const bulkUpdate = require('./bulkUpdate.js');
app.use('/update/bulk', Verify.jwtAuth, Verify.exists, Verify.checkAdmin, bulkUpdate);

const empUpdate = require('./empUpdate.js');
app.use('/update', Verify.jwtAuth, Verify.exists, empUpdate);

const del = require('./delete.js');
app.use('/delete', Verify.jwtAuth, Verify.exists, Verify.checkAdmin, del);

const useCreate = require('./create.js');
app.use('/create', Verify.jwtAuth, Verify.checkAdmin, useCreate);

const useLogin = require('./login.js');
app.use('/login', Verify.exists, useLogin);

const salaryList = require('./topSalary.js');
app.use('/salarylist', Verify.jwtAuth, Verify.checkAdmin, Verify.exists, salaryList);

app.listen(port, () => {
    console.log(`listening to port ${port}`);
})