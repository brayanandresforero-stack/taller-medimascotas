const pool = require('../config/db');

const getAll = async () => {
  const [rows] = await pool.query(
    'SELECT * FROM veterinarios ORDER BY IDVeterinario DESC'
  );
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM veterinarios WHERE IDVeterinario = ?', [id]
  );
  return rows[0]; 
};

const create = async (datos) => {
  const { Nombre, Apellido, Especialidad, Titulo, FechaNacimiento } = datos;
  const [result] = await pool.query(
    'INSERT INTO veterinarios (Nombre, Apellido, Especialidad, Titulo, FechaNacimiento) VALUES (?, ?, ?, ?, ?)',
    [Nombre, Apellido, Especialidad, Titulo, FechaNacimiento]
  );
  return { IDVeterinario: result.insertId, ...datos };
};

const update = async (id, datos) => {
  const { Nombre, Apellido, Especialidad, Titulo, FechaNacimiento } = datos;
  const [result] = await pool.query(
    'UPDATE veterinarios SET Nombre = ?, Apellido = ?, Especialidad = ?, Titulo = ?, FechaNacimiento = ? WHERE IDVeterinario = ?',
    [Nombre, Apellido, Especialidad, Titulo, FechaNacimiento, id]
  );
  return { IDVeterinario: id, ...datos };
};

const remove = async (id) => {
  const [result] = await pool.query(
    'DELETE FROM veterinarios WHERE IDVeterinario = ?', [id]
  );
  return result.affectedRows > 0;
};

module.exports = { getAll, getById, create, update, remove };