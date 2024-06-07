const express = require('express');
const router = express.Router();
const { getId, getIdHistory } = require('../modules/readModule.js');
const { verifyIndex } = require('../modules/verifyData.js');
//route gets employee data along with history of updates to employee details

router.get('/history/:id', verifyIndex, getIdHistory);

//route gets details of emp with specified id

router.get('/:id', verifyIndex, getId);

module.exports = router;