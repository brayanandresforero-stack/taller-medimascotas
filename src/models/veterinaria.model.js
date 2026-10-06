// Importación del pool de conexiones configurado para la base de datos MySQL
const pool = require('../config/db');

// Función asíncrona para obtener todos los registros de la tabla medicamentos
const getAll = async () => {
  // Ejecuta la consulta SQL ordenando los resultados de forma descendente por la clave primaria (cambiar el ID por la entidad correspondiente)
  const [rows] = await pool.query(
    'SELECT * FROM veterinaria ORDER BY IDVeterinaria DESC'
  );
  // Retorna el arreglo con todas las filas encontradas
  return rows;
};

// Función asíncrona para obtener un medicamento específico mediante su ID
const getById = async (id) => {
  // Consulta parametrizada utilizando '?' para prevenir inyecciones SQL (cambiar el ID por la entidad correspondiente)
  const [rows] = await pool.query(
    'SELECT * FROM veterinaria WHERE IDVeterinaria = ?', [id]
  );
  // Retorna únicamente el primer registro del arreglo obtenido
  return rows[0]; 
};

// Función asíncrona para insertar un nuevo dato en la base de datos
const create = async (datos) => {
  // Extrae los campos requeridos del objeto de datos recibido (cambiar segun el nombre de la entidad y sus atributos (columnas))
  const { nombre, DocumentoLocal, direccion, telefono, created_at } = datos;
  // Ejecuta la sentencia INSERT con los valores extraídos (cambiar segun el nombre de la entidad y sus atributos (columnas))
  const [result] = await pool.query(
    'INSERT INTO veterinaria (nombre, DocumentoLocal, direccion, telefono, created_at) VALUES (?, ?, ?, ?, ?)',
    [nombre, DocumentoLocal, direccion, telefono, created_at]
  );
  // Retorna el nuevo objeto incluyendo el ID autogenerado por MySQL (insertId) cambiar la id del retorno por la entidad correspondiente
  return { IDVeterinaria: result.insertId, ...datos };
};

// Función asíncrona para actualizar los datos de un veterinario existente
const update = async (id, datos) => {
  // Extrae las propiedades a modificar desde el objeto de datos
  const { NombreVeterinaria, Especialidad, Telefono, Email } = datos;
  // Ejecuta la sentencia UPDATE filtrando por la clave primaria ID de la entidad (cambiar segun el nombre de la entidad y sus atributos (columnas))
  const [result] = await pool.query(
    'UPDATE veterinaria SET nombre = ?, DocumentoLocal = ?, direccion = ?, telefono = ?, created_at = ? WHERE IDVeterinaria = ?',
    [nombre, DocumentoLocal, direccion, telefono, created_at, id]
  );
  // Retorna la información actualizada adjuntando el ID correspondiente
  return { IDVeterinaria: id, ...datos };
};

// Función asíncrona para eliminar un registro por su ID
const remove = async (id) => {
  // Ejecuta la consulta de eliminación DELETE cambiar segun el nombre de la entidad y su clave primaria
  const [result] = await pool.query(
    'DELETE FROM veterinaria WHERE IDVeterinaria = ?', [id]
  );
  // Evalúa si se eliminó al menos una fila y retorna un valor booleano (true/false)
  return result.affectedRows > 0;
};

// Exportación de las funciones del modelo para ser consumidas por el controlador
module.exports = { getAll, getById, create, update, remove };