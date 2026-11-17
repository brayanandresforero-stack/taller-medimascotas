// Importación del modelo que maneja las consultas SQL para productos
const productosModel = require('../models/productos.model');

// Controlador para obtener todos los productos
const getAll = async (req, res) => {
  try {
    // Consulta al modelo para traer la lista completa
    const data = await productosModel.getAll();
    // Responde con estado 200 (por defecto) y la estructura JSON esperada
    res.json({ ok: true, data });
  } catch (error) {
    // Captura cualquier fallo de la base de datos y responde con estado 500
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// Controlador para obtener un producto específico mediante su ID
const getById = async (req, res) => {
  try {
    // Extrae el parámetro :id enviado en la URL
    const { id } = req.params;
    // Consulta al modelo buscando el registro por su ID
    const item = await productosModel.getById(id);

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

// Controlador para crear un nuevo producto
const create = async (req, res) => {
  try {
    // Envía el cuerpo de la petición (req.body) al modelo para ser insertado
    const data = await productosModel.create(req.body);
    // Responde con estado 201 Created indicando éxito en la creación
    res.status(201).json({ ok: true, data });
  } catch (error) {
    // Captura errores de validación SQL o conexión y retorna estado 500
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// Controlador para actualizar un producto existente por su ID (Optimizado con COALESCE según patrón de arquitectura)
const update = async (req, res) => {
  try {
    // Extrae el ID del registro desde la URL
    const { id } = req.params;
    
    // Ejecuta la actualización en el modelo (retorna affectedRows según análisis visual)
    const affected = await productosModel.update(id, req.body);

    // Valida si la fila no fue modificada/encontrada (affected === 0)
    if (!affected) {
      // Responde con estado 404 si el registro no existe
      return res.status(404).json({ ok: false, msg: 'No encontrado' });
    }

    // Consulta el registro actualizado para retornarlo completamente en la respuesta
    const data = await productosModel.getById(id);

    // Responde con la información del registro actualizado
    res.json({ ok: true, data });
  } catch (error) {
    // Manejo de errores del servidor
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// Controlador para eliminar un producto por su ID
const remove = async (req, res) => {
  try {
    // Extrae el ID enviado desde los parámetros de la URL
    const { id } = req.params;
    // Llama al método de eliminación del modelo (retorna affectedRows)
    const affected = await productosModel.remove(id);

    // Si el modelo retorna 0 filas afectadas, el ID no existía
    if (!affected) {
      // Retorna respuesta 404 indicando recurso no encontrado
      return res.status(404).json({ ok: false, msg: 'No encontrado' });
    }

    // Confirma la eliminación exitosa al cliente
    res.json({ ok: true, msg: 'Producto eliminado' });
  } catch (error) {
    // Manejo de errores inesperados o fallos de la base de datos
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// Exportación de las funciones para ser utilizadas en el archivo de rutas
module.exports = { getAll, getById, create, update, remove };