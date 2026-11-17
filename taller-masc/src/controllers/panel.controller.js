const pool = require('../config/db');

const fallo = (res, e) => {
  console.error(e);
  res.status(500).json({ ok: false, msg: 'Error del servidor' });
};

const susVeterinarias = async (veterinarioId) => {
  const [rows] = await pool.query(
    'SELECT * FROM veterinarias WHERE veterinario_id = ? ORDER BY id DESC', [veterinarioId]
  );
  return rows;
};

// Ids de veterinaria que este veterinario puede ver. Con ?veterinaria_id=X solo esa,
// y solo si es suya. Devuelve null si pide una que no le pertenece.
const idsPermitidos = async (req) => {
  const ids = (await susVeterinarias(req.user.veterinarioId)).map((v) => v.id);
  const pedido = req.query.veterinaria_id;
  if (pedido) {
    const n = Number(pedido);
    return ids.includes(n) ? [n] : null;
  }
  return ids;
};

// Crea el handler de una lista filtrada por las veterinarias del veterinario
const listaPorVeterinaria = (consulta, sinSuId = false) => async (req, res) => {
  try {
    const ids = await idsPermitidos(req);
    if (ids === null) return res.status(403).json({ ok: false, msg: 'Esa veterinaria no es tuya' });
    if (!ids.length) return res.json({ ok: true, data: [] });
    const params = sinSuId ? [ids, req.user.id] : [ids];
    const [rows] = await pool.query(consulta, params);
    res.json({ ok: true, data: rows });
  } catch (e) {
    fallo(res, e);
  }
};

const veterinarias = async (req, res) => {
  try {
    res.json({ ok: true, data: await susVeterinarias(req.user.veterinarioId) });
  } catch (e) {
    fallo(res, e);
  }
};

const crearVeterinaria = async (req, res) => {
  try {
    const { nombre, direccion, barrio, telefono, horario } = req.body;
    if (!nombre || !direccion) {
      return res.status(400).json({ ok: false, msg: 'El nombre y la dirección son obligatorios' });
    }
    const [r] = await pool.query(
      'INSERT INTO veterinarias (veterinario_id, nombre, direccion, barrio, telefono, horario) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.veterinarioId, nombre, direccion, barrio || null, telefono || null, horario || null]
    );
    const [rows] = await pool.query('SELECT * FROM veterinarias WHERE id = ?', [r.insertId]);
    res.status(201).json({ ok: true, data: rows[0] });
  } catch (e) {
    fallo(res, e);
  }
};

const citas = listaPorVeterinaria(
  'SELECT * FROM citas WHERE veterinaria_id IN (?) ORDER BY fecha_hora DESC'
);
const consultas = listaPorVeterinaria(
  'SELECT * FROM consultas WHERE veterinaria_id IN (?) ORDER BY id DESC'
);
const inventario = listaPorVeterinaria(
  'SELECT * FROM inventario WHERE veterinaria_id IN (?) ORDER BY id DESC'
);
// Empleados de sus veterinarias (sin la contraseña y sin él mismo)
const empleados = listaPorVeterinaria(
  `SELECT e.id, e.nombre, e.email, e.cargo, e.salario, e.veterinaria_id, v.nombre AS veterinaria
     FROM empleados e
     JOIN veterinarias v ON v.id = e.veterinaria_id
    WHERE e.veterinaria_id IN (?) AND e.id <> ?
    ORDER BY e.id DESC`,
  true
);

module.exports = { veterinarias, crearVeterinaria, citas, consultas, inventario, empleados };
