const express = require('express');
const userauthenticate=require('../middleware/auth');

const featuresController = require('../controllers/premiumFeature');

const router = express.Router();

router.get('/showLeaderBoard',userauthenticate.authenticate,featuresController.getleaderBoard);


module.exports = router;