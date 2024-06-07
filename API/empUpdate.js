const express = require('express');
const router = express.Router();
const Verify = require('../modules/verifyData.js');
const { update, updatePwd, verifyIndexByEmail, authorizeUser, passAuth, setRoute } = require('../modules/updateModule.js')
const { verifyIndex } = require('../modules/verifyData.js');

// update route to update employee details
router.put('/emp/:id', setRoute, verifyIndex, authorizeUser,
      Verify.verifyName,
      Verify.verifyAge,
      Verify.verifyEmail,
      Verify.verifyDep,
      Verify.verifyPass,
      Verify.verifyPos,
      Verify.verifySal,
      Verify.verifyPriv,
      Verify.verifyRating,
      update);

// update route to update employee password
router.put('/password', passAuth, Verify.verifyPass, verifyIndexByEmail, updatePwd);

module.exports = router;