const express = require('express');
const userauthenticate=require('../middleware/auth');

const purchaseController = require('../controllers/purchase');

const router = express.Router();

router.get('/purchase/premium',userauthenticate.authenticate,purchaseController.purchasePremium)
router.post('/purchase/updatetransaction',userauthenticate.authenticate,purchaseController.updateTransactionStatus)
module.exports = router;