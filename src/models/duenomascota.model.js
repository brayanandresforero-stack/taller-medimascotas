// Importación del pool de conexiones configurado para la base de datos MySQL
const pool = require('../config/db');

// Función asíncrona para obtener todos los registros de la tabla empleados
const getAll = async () => {
  // Ejecuta la consulta SQL ordenando los resultados de forma descendente por la clave primaria (cambiar el ID por la entidad correspondiente)
  const [rows] = await pool.query(
    'SELECT * FROM duenomascota ORDER BY IdDueno DESC'
  );
  // Retorna el arreglo con todas las filas encontradas
  return rows;
};
 
// Función asíncrona para obtener un empleado específico mediante su ID
const getById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM duenomascota WHERE IdDueno = ?', [id]
  );
  return rows[0]; 
};

const create = async (datos) => {
  const {IdDueno, Nombre, Apellido, Direccion, Telefono} = datos;
  
  const [result] = await pool.query(
    'INSERT INTO duenomascota (IdDueno, Nombre, Apellido, Direccion, Telefono) VALUES (?, ?, ?, ?, ?)',
    [IdDueno, Nombre, Apellido, Direccion, Telefono]
  );
  
  return { IdDueno: result.insertId, ...datos };
};


const update = async (id, datos) => {
  const { Nombre, Apellido, Direccion, Telefono } = datos;
  const [result] = await pool.query(
    'UPDATE duenomascota SET Nombre = ?, Apellido = ?, Direccion = ?, Telefono = ? WHERE IdDueno = ?',
    [Nombre, Apellido, Direccion, Telefono, id]
  );
  return { IdDueno: id, ...datos };
};

const remove = async (id) => {
  const [result] = await pool.query(
    'DELETE FROM duenomascota WHERE IdDueno = ?', [id]
  );
  return result.affectedRows > 0;
};

module.exports = { getAll, getById, create, update, remove };