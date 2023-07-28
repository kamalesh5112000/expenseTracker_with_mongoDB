const express = require('express');
const userauthenticate=require('../middleware/auth');

const analysisController = require('../controllers/analysisController');

const router = express.Router();

router.get('/analysis',userauthenticate.authenticate,analysisController.showdata);
router.get('/download',userauthenticate.authenticate,analysisController.downloadexpense);
router.get('/filesdownloaded',userauthenticate.authenticate,analysisController.filedownload);

module.exports=router;