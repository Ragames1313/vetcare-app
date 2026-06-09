const express = require('express');
const mascotaController = require('../controllers/mascotaController');

const router = express.Router();

router.get('/', mascotaController.getAllMascotas);
router.get('/:id', mascotaController.getMascotaById);
router.post('/', mascotaController.createMascota);
router.put('/:id', mascotaController.updateMascota);
router.delete('/:id', mascotaController.deleteMascota);

module.exports = router;
