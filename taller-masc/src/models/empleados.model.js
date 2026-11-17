// Importación del pool de conexiones configurado para la base de datos MySQL
const pool = require('../config/db');

// Función asíncrona para obtener todos los registros de la tabla empleados
const getAll = async () => {
  // Ejecuta la consulta SQL ordenando los resultados de forma descendente por la clave primaria
  const [rows] = await pool.query(
    'SELECT * FROM empleados ORDER BY id DESC'
  );
  // Retorna el arreglo con todas las filas encontradas
  return rows;
};

// Función asíncrona para obtener un empleado específico mediante su ID
const getById = async (id) => {
  // Consulta parametrizada utilizando '?' para prevenir inyecciones SQL
  const [rows] = await pool.query(
    'SELECT * FROM empleados WHERE id = ?', [id]
  );
  // Retorna únicamente el primer registro del arreglo obtenido
  return rows[0]; 
};

// Función asíncrona para insertar un nuevo dato en la base de datos
const create = async (datos) => {
  // Extrae los campos requeridos del objeto de datos recibido
  const { nombre, cargo, password, salario } = datos;
  // Ejecuta la sentencia INSERT con los valores extraídos
  const [result] = await pool.query(
    'INSERT INTO empleados (nombre, cargo, password, salario) VALUES (?, ?, ?, ?)',
    [nombre, cargo, password, salario]
  );
  // Retorna el nuevo objeto incluyendo el ID autogenerado por MySQL (insertId)
  return { id: result.insertId, ...datos };
};

// Función asíncrona para actualizar los datos de un empleado existente (con COALESCE)
const update = async (id, { nombre, cargo, password, salario }) => {
  // Ejecuta la sentencia UPDATE utilizando COALESCE para permitir actualizaciones parciales o totales
  const [result] = await pool.query(
    `UPDATE empleados 
     SET nombre = COALESCE(?, nombre), 
         cargo = COALESCE(?, cargo), 
         salario = COALESCE(?, salario),
         password = COALESCE(?, password)
     WHERE id = ?`,
    [nombre, cargo, salario, password, id]
  );
  // Retorna el número de filas afectadas (0 si no existe)
  return result.affectedRows;
};

// Función asíncrona para eliminar un registro por su ID
const remove = async (id) => {
  // Ejecuta la consulta de eliminación DELETE
  const [result] = await pool.query(
    'DELETE FROM empleados WHERE id = ?', [id]
  );
  // Retorna el número de filas afectadas (0 si no existía)
  return result.affectedRows;
};

// Exportación de las funciones del modelo para ser consumidas por el controlador
module.exports = { getAll, getById, create, update, remove };