//rutas protegidas 
const router         = require('express').Router();
const { verificarToken } = require('../middlewares/authMiddleware');
const ctrl = require('../controllers/duenomascota.controller');

// Definición de la ruta HTTP GET para consultar el listado completo de la entidad "duenomascota" 
// Rutas PROTEGIDAS — requieren token válido
router.get('/:id', verificarToken, ctrl.getById);
router.get('/',     verificarToken, ctrl.getAll);
router.post('/',       verificarToken, ctrl.create);
router.put('/:id',    verificarToken, ctrl.update);
router.delete('/:id', verificarToken, ctrl.remove);

module.exports = router;