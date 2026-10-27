// Importación del pool de conexiones configurado para la base de datos MySQL
const pool = require('../config/db');

// Función asíncrona para obtener todos los registros de la tabla empleados
const getAll = async () => {
  // Ejecuta la consulta SQL ordenando los resultados de forma descendente por la clave primaria (cambiar el ID por la entidad correspondiente)
  const [rows] = await pool.query(
    'SELECT * FROM empleados ORDER BY IdEmpleado DESC'
  );
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM empleados WHERE IdEmpleado = ?', [id]
  );
  return rows[0]; 
};


const create = async (datos) => {
  const { nombre, apellido, documento, email, telefono, cargo,  salario, fecha_ingreso, IDVeterinaria, IDVeterinario} = datos;
  const [result] = await pool.query(
    'INSERT INTO empleados (nombre, apellido, documento, email, telefono, cargo,  salario, fecha_ingreso, IDVeterinaria, IDVeterinario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [nombre, apellido, documento, email, telefono, cargo,  salario, fecha_ingreso, IDVeterinaria, IDVeterinario]
  );

  return { IdEmpleado: result.insertId, ...datos };
};

const update = async (id, datos) => {
  
  const { nombre, apellido, documento, email, telefono, cargo,  salario, fecha_ingreso, IDVeterinaria, IDVeterinario} = datos;
  
  const [result] = await pool.query(
    'UPDATE empleados SET nombre = ?, apellido = ?, documento = ?, email = ?, telefono = ?, cargo = ?, salario = ?, fecha_ingreso = ?, IDVeterinaria = ?, IDVeterinario = ? WHERE IdEmpleado = ?',
    [nombre, apellido, documento, email, telefono, cargo, salario, fecha_ingreso, IDVeterinaria, IDVeterinario, id]
  );
  // Retorna la información actualizada adjuntando el ID correspondiente
  return { IdEmpleado: id, ...datos };
};

// Función asíncrona para eliminar un registro por su ID
const remove = async (id) => {
  // Ejecuta la consulta de eliminación DELETE cambiar segun el nombre de la entidad y su clave primaria
  const [result] = await pool.query(
    'DELETE FROM empleados WHERE IdEmpleado = ?', [id]
  );
  // Evalúa si se eliminó al menos una fila y retorna un valor booleano (true/false)
  return result.affectedRows > 0;
};

// Exportación de las funciones del modelo para ser consumidas por el controlador
module.exports = { getAll, getById, create, update, remove };

//guardar