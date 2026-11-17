// Importación del modelo que maneja las consultas SQL para medicamentos (cambiar el nombre de nuevo modelo)
const MedicamentosModel = require('../models/medicamentos.model');

// Controlador para obtener todos los medicamentos
const getAll = async (req, res) => {
  try {
    // Consulta al modelo para traer la lista completa (cambiar el nombre de nuevo modelo)
    const data = await MedicamentosModel.getAll();
    // Responde con estado 200 (por defecto) y la estructura JSON esperada
    res.json({ ok: true, data });
  } catch (error) {
    // Captura cualquier fallo de la base de datos y responde con estado 500
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// Controlador para obtener un medicamento específico mediante su ID
const getById = async (req, res) => {
  try {
    // Extrae el parámetro :id enviado en la URL
    const { id } = req.params;
    // Consulta al modelo buscando el registro por su ID (cambiar el nombre de nuevo modelo)
    const item = await MedicamentosModel.getById(id);

    // Valida si la consulta no devolvió ningún registro
    if (!item) {
      // Responde con estado 404 Not Found si el registro no existe
      return res.status(404).json({ ok: false, msg: 'No encontrado' });
    }

    // Responde con el registro encontrado
    res.json({ ok: true, data: item });
  } catch (error) {
    // Captura errores de ejecución o conexión y retorna estado 500
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// Controlador para crear un nuevo medicamento
const create = async (req, res) => {
  try {
    // Envía el cuerpo de la petición (req.body) al modelo para ser insertado (cambiar el nombre de nuevo modelo)
    const data = await MedicamentosModel.create(req.body);
    // Responde con estado 201 Created indicando éxito en la creación
    res.status(201).json({ ok: true, data });
  } catch (error) {
    // Captura errores de validación SQL o conexión y retorna estado 500
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// Controlador para actualizar un medicamento existente por su ID
const update = async (req, res) => {
  try {
    // Extrae el ID del registro desde la URL
    const { id } = req.params;
    // Pasa el ID y la información enviada en el cuerpo para actualizar (cambiar el nombre de nuevo modelo)
    const itemActualizado = await MedicamentosModel.update(id, req.body);

    // Valida si el modelo retorna null o undefined (id no encontrado)
    if (!itemActualizado) {
      // Responde con estado 404 si la fila no fue modificada/encontrada
      return res.status(404).json({ ok: false, msg: 'No encontrado' });
    }

    // Responde con la información del registro actualizado
    res.json({ ok: true, data: itemActualizado });
  } catch (error) {
    // Manejo de errores del servidor
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// Controlador para eliminar un medicamento por su ID
const remove = async (req, res) => {
  try {
    // Extrae el ID enviado desde los parámetros de la URL
    const { id } = req.params;
    // Llama al método de eliminación del modelo (cambiar el nombre de nuevo modelo)
    const eliminado = await MedicamentosModel.remove(id);

    // Si el modelo retorna false o 0 filas afectadas, el ID no existía
    if (!eliminado) {
      // Retorna respuesta 404 indicando recurso no encontrado
      return res.status(404).json({ ok: false, msg: 'No encontrado' });
    }

    // Confirma la eliminación exitosa al cliente (cambiar el nombre de nuevo mensaje msg)
    res.json({ ok: true, msg: 'Medicamento eliminado' });
  } catch (error) {
    // Manejo de errores inesperados o fallos de la base de datos
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// Exportación de las funciones para ser utilizadas en el archivo de rutas
module.exports = { getAll, getById, create, update, remove };