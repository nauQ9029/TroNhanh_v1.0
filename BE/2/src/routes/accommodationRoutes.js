const express = require('express');
const router = express.Router();
const accCtrl = require('../controllers/accommodationController');

router.post('/', accCtrl.createAccommodation);
router.get('/', accCtrl.getAllAccommodations);
router.get('/:id', accCtrl.getAccommodationById);
router.put('/:id', accCtrl.updateAccommodation);
router.delete('/:id', accCtrl.deleteAccommodation);

module.exports = router;
