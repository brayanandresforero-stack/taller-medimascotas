// Importación del pool de conexiones configurado para la base de datos MySQL
const pool = require('../config/db');

// Función asíncrona para obtener todos los registros de la tabla mascota
const getAll = async () => {
  // Ejecuta la consulta SQL ordenando los resultados de forma descendente por la clave primaria (cambiar el ID por la entidad correspondiente)
  const [rows] = await pool.query(
    'SELECT * FROM inventario ORDER BY IdInventario DESC'
  );
  // Retorna el arreglo con todas las filas encontradas
  return rows;
};

// Función asíncrona para obtener un empleado específico mediante su ID
const getById = async (id) => {
  // Consulta parametrizada utilizando '?' para prevenir inyecciones SQL (cambiar el ID por la entidad correspondiente)
  const [rows] = await pool.query(
    'SELECT * FROM inventario WHERE IdInventario = ?', [id]
  );
  // Retorna únicamente el primer registro del arreglo obtenido
  return rows[0]; 
};

// Función asíncrona para insertar un nuevo dato en la base de datos
const create = async (datos) => {
  // Extrae los campos requeridos del objeto de datos recibido (cambiar segun el nombre de la entidad y sus atributos (columnas))
  const { IDInventario, IDMedicamentos, Cantidad, Precio, IDVeterinaria } = datos;
  // Ejecuta la sentencia INSERT con los valores extraídos (cambiar segun el nombre de la entidad y sus atributos (columnas))
  const [result] = await pool.query(
    'INSERT INTO inventario (IDInventario, IDMedicamentos, Cantidad, Precio, IDVeterinaria) VALUES (?, ?, ?, ?, ?)',
    [IDInventario, IDMedicamentos, Cantidad, Precio, IDVeterinaria]
  );
  // Retorna el nuevo objeto incluyendo el ID autogenerado por MySQL (insertId) cambiar la id del retorno por la entidad correspondiente
  return { IdInventario: result.insertId, ...datos };
};

// Función asíncrona para actualizar los datos de un empleado existente
const update = async (id, datos) => {
  // Extrae las propiedades a modificar desde el objeto de datos
  const { IDInventario, IDMedicamentos, Cantidad, Precio, IDVeterinaria } = datos;
  // Ejecuta la sentencia UPDATE filtrando por la clave primaria IdInventario de la entidad (cambiar segun el nombre de la entidad y sus atributos (columnas))
  const [result] = await pool.query(
    'UPDATE inventario SET IDInventario = ?, IDMedicamentos = ?, Cantidad = ?, Precio = ?, IDVeterinaria = ? WHERE IdInventario = ?',
    [IDInventario, IDMedicamentos, Cantidad, Precio, IDVeterinaria, id]
  );
  // Retorna la información actualizada adjuntando el ID correspondiente
  return { IdInventario: id, ...datos };
};

// Función asíncrona para eliminar un registro por su ID
const remove = async (id) => {
  // Ejecuta la consulta de eliminación DELETE cambiar segun el nombre de la entidad y su clave primaria
  const [result] = await pool.query(
    'DELETE FROM inventario WHERE IdInventario = ?', [id]
  );
  // Evalúa si se eliminó al menos una fila y retorna un valor booleano (true/false)
  return result.affectedRows > 0;
};

// Exportación de las funciones del modelo para ser consumidas por el controlador
module.exports = { getAll, getById, create, update, remove };