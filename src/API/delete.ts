import express from 'express';
const router = express.Router();
import {DeleteModule} from '../modules/deleteModule.js';
import {Verify} from '../modules/verifyData.js';

//route deletes all employee data from data file

router.delete('/all', DeleteModule.deleteAll);

//route deletes data of employee with specified id 

router.delete('/:id',
     Verify.verifyIndex, 
    DeleteModule.deleteId);

module.exports = router;