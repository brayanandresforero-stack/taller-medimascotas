// Importación del pool de conexiones configurado para la base de datos MySQL
const pool = require('../config/db');

// Función asíncrona para obtener todos los registros de la tabla medicamentos
const getAll = async () => {
  // Ejecuta la consulta SQL ordenando los resultados de forma descendente por la clave primaria (cambiar el ID por la entidad correspondiente)
  const [rows] = await pool.query(
    'SELECT * FROM medicamentos ORDER BY IDMedicamentos DESC'
  );
  // Retorna el arreglo con todas las filas encontradas
  return rows;
};

// Función asíncrona para obtener un medicamento específico mediante su ID
const getById = async (id) => {
  // Consulta parametrizada utilizando '?' para prevenir inyecciones SQL (cambiar el ID por la entidad correspondiente)
  const [rows] = await pool.query(
    'SELECT * FROM medicamentos WHERE IDMedicamentos = ?', [id]
  );
  // Retorna únicamente el primer registro del arreglo obtenido
  return rows[0]; 
};

// Función asíncrona para insertar un nuevo dato en la base de datos
const create = async (datos) => {
  // Extrae los campos requeridos del objeto de datos recibido (cambiar segun el nombre de la entidad y sus atributos (columnas))
  const { NombreMedicamento, TipoMedicamento, Especie, Raza, Genero, Descripcion } = datos;
  // Ejecuta la sentencia INSERT con los valores extraídos (cambiar segun el nombre de la entidad y sus atributos (columnas))
  const [result] = await pool.query(
    'INSERT INTO medicamentos (NombreMedicamento, TipoMedicamento, Especie, Raza, Genero, Descripcion) VALUES (?, ?, ?, ?, ?, ?)',
    [NombreMedicamento, TipoMedicamento, Especie, Raza, Genero, Descripcion]
  );
  // Retorna el nuevo objeto incluyendo el ID autogenerado por MySQL (insertId) cambiar la id del retorno por la entidad correspondiente
  return { IDMedicamentos: result.insertId, ...datos };
};

// Función asíncrona para actualizar los datos de un medicamento existente
const update = async (id, datos) => {
  // Extrae las propiedades a modificar desde el objeto de datos
  const { NombreMedicamento, TipoMedicamento, Especie, Raza, Genero, Descripcion } = datos;
  // Ejecuta la sentencia UPDATE filtrando por la clave primaria ID de la entidad (cambiar segun el nombre de la entidad y sus atributos (columnas))
  const [result] = await pool.query(
    'UPDATE medicamentos SET NombreMedicamento = ?, TipoMedicamento = ?, Especie = ?, Raza = ?, Genero = ?, Descripcion = ? WHERE IDMedicamentos = ?',
    [NombreMedicamento, TipoMedicamento, Especie, Raza, Genero, Descripcion, id]
  );
  // Retorna la información actualizada adjuntando el ID correspondiente
  return { IDMedicamentos: id, ...datos };
};

// Función asíncrona para eliminar un registro por su ID
const remove = async (id) => {
  // Ejecuta la consulta de eliminación DELETE cambiar segun el nombre de la entidad y su clave primaria
  const [result] = await pool.query(
    'DELETE FROM medicamentos WHERE IDMedicamentos = ?', [id]
  );
  // Evalúa si se eliminó al menos una fila y retorna un valor booleano (true/false)
  return result.affectedRows > 0;
};

// Exportación de las funciones del modelo para ser consumidas por el controlador
module.exports = { getAll, getById, create, update, remove };