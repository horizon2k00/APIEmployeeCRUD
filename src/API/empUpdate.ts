import express from 'express';
const router = express.Router();
import { Verify } from '../modules/verifyData';
import { UpdateModule } from '../modules/updateModule';

// update route to update employee details
router.put('/emp/:id', 
      UpdateModule.setRoute, 
      Verify.verifyIndex, 
      UpdateModule.authorizeUser,
      Verify.verifyName,
      Verify.verifyAge,
      Verify.verifyEmail,
      Verify.verifyDep,
      Verify.verifyPass,
      Verify.verifyPos,
      Verify.verifySal,
      Verify.verifyPriv,
      Verify.verifyRating,
      UpdateModule.update);

// update route to update employee password
router.put('/password', 
      UpdateModule.passAuth, 
      Verify.verifyPass, 
      UpdateModule.verifyIndexByEmail, 
      UpdateModule.updatePwd);

module.exports = router;