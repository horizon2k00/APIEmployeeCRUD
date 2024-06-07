const express = require('express');
const router = express.Router();
const { bulkUpdate } = require('../modules/updateModule.js')

//update api to update multiple salaries at once

router.put('/salary', bulkUpdate);

//update api to update multiple ratings at once

router.put('/rating', bulkUpdate);

//update api to update multiple employee ages at once

router.put('/age', bulkUpdate);

module.exports = router;