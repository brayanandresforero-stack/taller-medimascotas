const router = require('express').Router();
const { verificarToken } = require('../middlewares/authMiddleware');
const { soloEmpleado } = require('../middlewares/rolMiddleware');
const ctrl = require('../controllers/trabajo.controller');

// Todo exige token de un empleado (no veterinario)
router.use(verificarToken, soloEmpleado);

router.get('/',                    ctrl.estado);
router.post('/solicitudes',        ctrl.solicitar);
router.delete('/solicitudes/:id',  ctrl.retirar);
router.get('/citas',               ctrl.citas);

module.exports = router;
