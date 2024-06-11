import express from "express";
const router = express.Router();
import { UpdateModule } from "../modules/updateModule";

//update api to update multiple salaries at once

router.put('/salary', UpdateModule.bulkUpdate);

//update api to update multiple ratings at once

router.put('/rating', UpdateModule.bulkUpdate);

//update api to update multiple employee ages at once

router.put('/age', UpdateModule.bulkUpdate);

module.exports = router;