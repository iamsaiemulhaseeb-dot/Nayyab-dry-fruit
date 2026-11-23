const express = require('express');
const router  = express.Router();
const { getAll, create, updateStatus, remove } = require('../controllers/bulkInquiryController');

router.get('/',              getAll);
router.post('/',             create);
router.patch('/:id/status',  updateStatus);
router.delete('/:id',        remove);

module.exports = router;
