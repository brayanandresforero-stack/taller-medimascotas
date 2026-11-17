// Importación del pool de conexiones configurado para la base de datos MySQL
const pool = require('../config/db');

// Función asíncrona para obtener todos los registros de la tabla consultas
const getAll = async () => {
  // Ejecuta la consulta SQL ordenando los resultados de forma descendente por la clave primaria
  const [rows] = await pool.query(
    'SELECT * FROM consultas ORDER BY id DESC'
  );
  // Retorna el arreglo con todas las filas encontradas
  return rows;
};

// Función asíncrona para obtener una consulta específica mediante su ID
const getById = async (id) => {
  // Consulta parametrizada utilizando '?' para prevenir inyecciones SQL
  const [rows] = await pool.query(
    'SELECT * FROM consultas WHERE id = ?', [id]
  );
  // Retorna únicamente el primer registro del arreglo obtenido
  return rows[0]; 
};

// Función asíncrona para insertar un nuevo dato en la base de datos
const create = async (datos) => {
  // Extrae los campos requeridos del objeto de datos recibido
  const {
id,	cita_id,	veterinaria_id,	veterinario_id,	fecha,	motivo,	peso,	temperatura,	frecuencia_cardiaca,	diagnostico,	tratamiento,	observaciones,	fecha_hora,	revision	
} = datos;
  // Ejecuta la sentencia INSERT con los valores extraídos
  const [result] = await pool.query(
    'INSERT INTO consultas (id, cita_id, veterinaria_id, veterinario_id, fecha, motivo, peso, temperatura, frecuencia_cardiaca, diagnostico, tratamiento, observaciones, fecha_hora, revision) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, cita_id, veterinaria_id, veterinario_id, fecha, motivo, peso, temperatura, frecuencia_cardiaca, diagnostico, tratamiento, observaciones, fecha_hora, revision]
  );
  // Retorna el nuevo objeto incluyendo el ID autogenerado por MySQL (insertId)
  return { id: result.insertId, ...datos };
};

// Función asíncrona para actualizar los datos de una consulta existente (con COALESCE)
const update = async (id, { cita_id, veterinaria_id, veterinario_id, fecha, motivo, peso, temperatura, frecuencia_cardiaca, diagnostico, tratamiento, observaciones, fecha_hora, revision }) => {
  // Ejecuta la sentencia UPDATE utilizando COALESCE para permitir actualizaciones parciales o totales
  const [result] = await pool.query(
    `UPDATE consultas 
     SET cita_id = COALESCE(?, cita_id), 
         veterinaria_id = COALESCE(?, veterinaria_id), 
         veterinario_id = COALESCE(?, veterinario_id),
         fecha = COALESCE(?, fecha),
         motivo = COALESCE(?, motivo),
         peso = COALESCE(?, peso),
         temperatura = COALESCE(?, temperatura),
         frecuencia_cardiaca = COALESCE(?, frecuencia_cardiaca),
         diagnostico = COALESCE(?, diagnostico),
         tratamiento = COALESCE(?, tratamiento),
         observaciones = COALESCE(?, observaciones),
         fecha_hora = COALESCE(?, fecha_hora),
         revision = COALESCE(?, revision)
     WHERE id = ?`,
    [cita_id, veterinaria_id, veterinario_id, fecha, motivo, peso, temperatura, frecuencia_cardiaca, diagnostico, tratamiento, observaciones, fecha_hora, revision, id]
  );
  // Retorna el número de filas afectadas (0 si no existe)
  return result.affectedRows;
};

// Función asíncrona para eliminar un registro por su ID
const remove = async (id) => {
  // Ejecuta la consulta de eliminación DELETE
  const [result] = await pool.query(
    'DELETE FROM consultas WHERE id = ?', [id]
  );
  // Retorna el número de filas afectadas (0 si no existía)
  return result.affectedRows;
};

// Exportación de las funciones del modelo para ser consumidas por el controlador
module.exports = { getAll, getById, create, update, remove };