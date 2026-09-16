// Importación del framework Express
const express = require('express');

// Creación de una instancia de enrutador (Router) de Express
const router = express.Router();

// Importación del controlador que contiene la lógica de negocio para la entidad "duenomascota" (cambiar el nombre de nuevo controlador)
const ctrl = require('../controllers/duenomascota.controller');

// Definición de la ruta HTTP GET para consultar el listado completo de la entidad "duenomascota" 
router.get('/', ctrl.getAll);         // GET    la entidad "duenomascota"

// Definición de la ruta HTTP GET para obtener un dueno de mascota específico mediante su ID enviado por parámetro
router.get('/:id', ctrl.getById);    // GET    la entidad "duenomascota"

// Definición de la ruta HTTP POST para registrar un nuevo dueno de mascota
router.post('/', ctrl.create);       // POST   la entidad "duenomascota"

// Definición de la ruta HTTP PUT para modificar un dueno de mascota existente por su ID
router.put('/:id', ctrl.update);     // PUT    la entidad "duenomascota"

// Definición de la ruta HTTP DELETE para remover un dueno de mascota de la base de datos por su ID
router.delete('/:id', ctrl.remove);  // DELETE la entidad "duenomascota"

// Exportación del módulo de rutas para asociarlo en el archivo principal (app.js)
module.exports = router;