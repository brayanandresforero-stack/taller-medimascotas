//rutas protegidas 
const router         = require('express').Router();
const { verificarToken } = require('../middlewares/authMiddleware');
const ctrl = require('../controllers/veterinarios.controller');

// Ruta privada que recibe el ID del veterinario
router.get('/:id', verificarToken, ctrl.getById);

// Definición de la ruta HTTP GET para consultar el listado completo de la entidad "veterinario" 
router.get('/',     verificarToken, ctrl.getAll);
router.post('/',       verificarToken, ctrl.create);
router.put('/:id',    verificarToken, ctrl.update);
router.delete('/:id', verificarToken, ctrl.remove);

module.exports = router;