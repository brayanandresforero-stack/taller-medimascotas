// Importación del pool de conexiones configurado para la base de datos MySQL
const pool = require('../config/db');

// Función asíncrona para obtener todos los registros de la tabla mascotas
const getAll = async () => {
  // Ejecuta la consulta SQL ordenando los resultados de forma descendente por la clave primaria
  const [rows] = await pool.query(
    'SELECT * FROM mascotas ORDER BY id DESC'
  );
  // Retorna el arreglo con todas las filas encontradas
  return rows;
};

// Función asíncrona para obtener una mascota específica mediante su ID
const getById = async (id) => {
  // Consulta parametrizada utilizando '?' para prevenir inyecciones SQL
  const [rows] = await pool.query(
    'SELECT * FROM mascotas WHERE id = ?', [id]
  );
  // Retorna únicamente el primer registro del arreglo obtenido
  return rows[0]; 
};

// Función asíncrona para insertar un nuevo dato en la base de datos
const create = async (datos) => {
  // Extrae los campos requeridos del objeto de datos recibido
  const {	id,	usuario_id	,nombre	,especie_id,	raza_id,	sexo,	fecha_nacimiento	,color,	peso,	esterilizado,	foto,	estado	,
} = datos;
  // Ejecuta la sentencia INSERT con los valores extraídos
  const [result] = await pool.query(
    'INSERT INTO mascotas (id, usuario_id, nombre, especie_id, raza_id, sexo, fecha_nacimiento, color, peso, esterilizado, foto, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, usuario_id, nombre, especie_id, raza_id, sexo, fecha_nacimiento, color, peso, esterilizado, foto, estado]
  );
  // Retorna el nuevo objeto incluyendo el ID autogenerado por MySQL (insertId)
  return { id: result.insertId, ...datos };
};

// Función asíncrona para actualizar los datos de una mascota existente (con COALESCE)
const update = async (id, usuario_id, nombre, especie_id, raza_id, sexo, fecha_nacimiento, color, peso, esterilizado, foto, estado) => {
  // Ejecuta la sentencia UPDATE utilizando COALESCE para permitir actualizaciones parciales o totales
  const [result] = await pool.query(
    `UPDATE mascotas 
     SET nombre = COALESCE(?, nombre), 
         especie_id = COALESCE(?, especie_id), 
         raza_id = COALESCE(?, raza_id),
         sexo = COALESCE(?, sexo),
            fecha_nacimiento = COALESCE(?, fecha_nacimiento),
            color = COALESCE(?, color),
            peso = COALESCE(?, peso),
            esterilizado = COALESCE(?, esterilizado),
            foto = COALESCE(?, foto),
            estado = COALESCE(?, estado)
     WHERE id = ?`,
    [nombre, especie_id, raza_id, sexo, fecha_nacimiento, color, peso, esterilizado, foto, estado, id]
  );
  // Retorna el número de filas afectadas (0 si no existe)
  return result.affectedRows;
};

// Función asíncrona para eliminar un registro por su ID
const remove = async (id) => {
  // Ejecuta la consulta de eliminación DELETE
  const [result] = await pool.query(
    'DELETE FROM mascotas WHERE id = ?', [id]
  );
  // Retorna el número de filas afectadas (0 si no existía)
  return result.affectedRows;
};

// Exportación de las funciones del modelo para ser consumidas por el controlador
module.exports = { getAll, getById, create, update, remove };