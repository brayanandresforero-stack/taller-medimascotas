<<<<<<< HEAD:src/routes/mascota.routes.js
//rutas protegidas 
const router         = require('express').Router();
const { verificarToken } = require('../middlewares/authMiddleware');
const ctrl = require('../controllers/mascota.controller');

// Definición de la ruta HTTP GET para consultar el listado completo de la entidad "mascota" 

router.get('/:id', verificarToken, ctrl.getById);
router.get('/',     verificarToken, ctrl.getAll);
router.post('/',       verificarToken, ctrl.create);
router.put('/:id',    verificarToken, ctrl.update);
router.delete('/:id', verificarToken, ctrl.remove);

=======
// Importación del framework Express
const express = require('express');

// Creación de una instancia de enrutador (Router) de Express
const router = express.Router();

// Importación del controlador que contiene la lógica de negocio para la entidad "mascotas" (cambiar el nombre de nuevo controlador)
const ctrl = require('../controllers/mascota.controller');

// Definición de la ruta HTTP GET para consultar el listado completo de la entidad "mascotas" 
router.get('/', ctrl.getAll);         // GET    la entidad "mascotas"

// Definición de la ruta HTTP GET para obtener una mascota específica mediante su ID enviado por parámetro
router.get('/:id', ctrl.getById);    // GET    la entidad "mascotas"

// Definición de la ruta HTTP POST para registrar un nueva mascota
router.post('/', ctrl.create);       // POST   la entidad "mascotas"

// Definición de la ruta HTTP PUT para modificar una mascota existente por su ID
router.put('/:id', ctrl.update);     // PUT    la entidad "mascotas"

// Definición de la ruta HTTP DELETE para remover una mascota de la base de datos por su ID
router.delete('/:id', ctrl.remove);  // DELETE la entidad "mascotas"

// Exportación del módulo de rutas para asociarlo en el archivo principal (app.js)
>>>>>>> 0a51981f32c7c15f4b198f323b4ef908ce8d25f3:taller-medimascotas/src/routes/mascota.routes.js
module.exports = router;