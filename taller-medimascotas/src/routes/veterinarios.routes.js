const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/veterinarios.controller');

router.get('/', ctrl.getAll);         // GET    /api/veterinarios
router.get('/:id', ctrl.getById);    // GET    /api/veterinarios/1
router.post('/', ctrl.create);       // POST   /api/veterinarios
router.put('/:id', ctrl.update);     // PUT    /api/veterinarios/1
router.delete('/:id', ctrl.remove);  // DELETE /api/veterinarios/1

module.exports = router;