// Importación del framework Express
const express = require('express');

// Creación de una instancia de enrutador (Router) de Express
const router = express.Router();

// Importación del controlador que contiene la lógica de negocio para la entidad "medicamentos" (cambiar el nombre de nuevo controlador)
const ctrl = require('../controllers/medicamentos.controller');

// Definición de la ruta HTTP GET para consultar el listado completo de la entidad "medicamentos" 
router.get('/', ctrl.getAll);         // GET    la entidad "medicamentos"

// Definición de la ruta HTTP GET para obtener un medicamento específico mediante su ID enviado por parámetro
router.get('/:id', ctrl.getById);    // GET    la entidad "medicamentos"

// Definición de la ruta HTTP POST para registrar un nuevo medicamento
router.post('/', ctrl.create);       // POST   la entidad "medicamentos"

// Definición de la ruta HTTP PUT para modificar un medicamento existente por su ID
router.put('/:id', ctrl.update);     // PUT    la entidad "medicamentos"

// Definición de la ruta HTTP DELETE para remover un medicamento de la base de datos por su ID
router.delete('/:id', ctrl.remove);  // DELETE la entidad "medicamentos"

// Exportación del módulo de rutas para asociarlo en el archivo principal (app.js)
module.exports = router;