const router = require('express').Router();
const { verificarToken } = require('../middlewares/authMiddleware');
const { soloVeterinario } = require('../middlewares/rolMiddleware');
const ctrl = require('../controllers/panel.controller');

// Todo el panel exige token de un veterinario
router.use(verificarToken, soloVeterinario);

router.get('/veterinarias',  ctrl.veterinarias);
router.post('/veterinarias', ctrl.crearVeterinaria);
router.get('/citas',         ctrl.citas);
router.get('/consultas',     ctrl.consultas);
router.get('/inventario',    ctrl.inventario);
router.get('/empleados',     ctrl.empleados);

module.exports = router;
