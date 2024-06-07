const express = require('express');
const router = express();
const { deleteAll, deleteId } = require('../modules/deleteModule.js');
const { verifyIndex } = require('../modules/verifyData.js');

//route deletes all employee data from data file

router.delete('/all', deleteAll);

//route deletes data of employee with specified id 

router.delete('/:id', verifyIndex, deleteId);

module.exports = router;