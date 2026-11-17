// Importación del pool de conexiones configurado para la base de datos MySQL
const pool = require('../config/db');

// Función asíncrona para obtener todos los registros de la tabla pedidos
const getAll = async () => {
  // Ejecuta la consulta SQL ordenando los resultados de forma descendente por la clave primaria
  const [rows] = await pool.query(
    'SELECT * FROM pedidos ORDER BY id DESC'
  );
  // Retorna el arreglo con todas las filas encontradas
  return rows;
};

// Función asíncrona para obtener un pedido específico mediante su ID
const getById = async (id) => {
  // Consulta parametrizada utilizando '?' para prevenir inyecciones SQL
  const [rows] = await pool.query(
    'SELECT * FROM pedidos WHERE id = ?', [id]
  );
  // Retorna únicamente el primer registro del arreglo obtenido
  return rows[0]; 
};

// Función asíncrona para insertar un nuevo dato en la base de datos
const create = async (datos) => {
  // Extrae los campos requeridos del objeto de datos recibido
  const {	id,	numero,	usuario_id,	veterinaria_id,	direccion_entrega,	estado,	descuento,costo_envio,total,	created_at	
} = datos;
  // Ejecuta la sentencia INSERT con los valores extraídos
  const [result] = await pool.query(
    'INSERT INTO pedidos (id, numero, usuario_id, veterinaria_id, direccion_entrega, estado, descuento, costo_envio, total, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, numero, usuario_id, veterinaria_id, direccion_entrega, estado, descuento, costo_envio, total, created_at]
  );
  // Retorna el nuevo objeto incluyendo el ID autogenerado por MySQL (insertId)
  return { id: result.insertId, ...datos };
};

// Función asíncrona para actualizar los datos de un pedido existente (con COALESCE)
const update = async (id, numero, usuario_id, veterinaria_id, direccion_entrega, estado, descuento, costo_envio, total, created_at) => {
  // Ejecuta la sentencia UPDATE utilizando COALESCE para permitir actualizaciones parciales o totales
  const [result] = await pool.query(
    `UPDATE pedidos 
     SET numero = COALESCE(?, numero), 
         usuario_id = COALESCE(?, usuario_id), 
         veterinaria_id = COALESCE(?, veterinaria_id),
         direccion_entrega = COALESCE(?, direccion_entrega),
         estado = COALESCE(?, estado),
         descuento = COALESCE(?, descuento),
         costo_envio = COALESCE(?, costo_envio),
         total = COALESCE(?, total),
         created_at = COALESCE(?, created_at)
     WHERE id = ?`,
    [numero, usuario_id, veterinaria_id, direccion_entrega, estado, descuento, costo_envio, total, created_at, id]
  );
  // Retorna el número de filas afectadas (0 si no existe)
  return result.affectedRows;
};

// Función asíncrona para eliminar un registro por su ID
const remove = async (id) => {
  // Ejecuta la consulta de eliminación DELETE
  const [result] = await pool.query(
    'DELETE FROM pedidos WHERE id = ?', [id]
  );
  // Retorna el número de filas afectadas (0 si no existía)
  return result.affectedRows;
};

// Exportación de las funciones del modelo para ser consumidas por el controlador
module.exports = { getAll, getById, create, update, remove };