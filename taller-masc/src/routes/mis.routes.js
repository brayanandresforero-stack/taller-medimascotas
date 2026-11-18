const router = require('express').Router();
const { verificarToken } = require('../middlewares/authMiddleware');
const { soloUsuario } = require('../middlewares/rolMiddleware');
const ctrl = require('../controllers/mis.controller');

// Todo exige token de una cuenta de usuario
router.use(verificarToken, soloUsuario);

router.get('/mascotas',            ctrl.mascotas);
router.post('/mascotas',           ctrl.crearMascota);
router.get('/citas',               ctrl.citas);
router.post('/citas',              ctrl.crearCita);
router.put('/citas/:id/cancelar',  ctrl.cancelarCita);
router.get('/consultas',           ctrl.consultas);

module.exports = router;
