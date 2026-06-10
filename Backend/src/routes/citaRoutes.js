const express = require('express');
const citaController = require('../controllers/citaController');

const router = express.Router();

router.get('/', citaController.getAllCitas);
router.get('/:id', citaController.getCitaById);
router.post('/', citaController.createCita);
router.put('/:id', citaController.updateCita);
router.delete('/:id', citaController.deleteCita);

module.exports = router;
