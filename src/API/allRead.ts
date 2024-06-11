import express from 'express';
const router = express.Router();
import { ReadModule } from '../modules/readModule.js';
import { Verify } from '../modules/verifyData.js';
//route gets employee data along with history of updates to employee details

router.get('/history/:id', Verify.verifyIndex, ReadModule.getIdHistory);

//route gets details of emp with specified id

router.get('/:id', Verify.verifyIndex, ReadModule.getId);

module.exports = router;