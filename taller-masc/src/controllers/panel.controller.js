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
  `SELECT c.id, DATE_FORMAT(c.fecha_hora, '%Y-%m-%d %H:%i') AS fecha_hora, c.estado,
          m.nombre AS mascota, u.nombre AS propietario, u.email AS correo,
          c.motivo, v.nombre AS veterinaria, c.observaciones
     FROM citas c
     JOIN veterinarias v  ON v.id = c.veterinaria_id
     LEFT JOIN mascotas m ON m.id = c.mascota_id
     LEFT JOIN usuarios u ON u.id = m.usuario_id
    WHERE c.veterinaria_id IN (?)
    ORDER BY c.fecha_hora DESC`
);

// Solicitudes de empleados para unirse a sus veterinarias (pendientes primero)
const solicitudes = listaPorVeterinaria(
  `SELECT s.id, s.estado, e.nombre AS empleado, e.email AS correo, s.cargo,
          v.nombre AS veterinaria, DATE_FORMAT(s.created_at, '%Y-%m-%d %H:%i') AS enviada
     FROM solicitudes_empleo s
     JOIN empleados e    ON e.id = s.empleado_id
     JOIN veterinarias v ON v.id = s.veterinaria_id
    WHERE s.veterinaria_id IN (?)
    ORDER BY (s.estado = 'pendiente') DESC, s.id DESC`
);

// PUT /api/panel/solicitudes/:id { accion: 'aceptar' | 'rechazar' }
const responderSolicitud = async (req, res) => {
  const { accion } = req.body;
  if (!['aceptar', 'rechazar'].includes(accion)) {
    return res.status(400).json({ ok: false, msg: 'La acción debe ser aceptar o rechazar' });
  }
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT s.id, s.empleado_id, s.veterinaria_id, s.cargo, s.estado
         FROM solicitudes_empleo s
         JOIN veterinarias v ON v.id = s.veterinaria_id
        WHERE s.id = ? AND v.veterinario_id = ?`,
      [req.params.id, req.user.veterinarioId]
    );
    const sol = rows[0];
    if (!sol) return res.status(404).json({ ok: false, msg: 'Esa solicitud no es de tus veterinarias' });
    if (sol.estado !== 'pendiente') {
      return res.status(409).json({ ok: false, msg: `Esta solicitud ya fue ${sol.estado}` });
    }

    await conn.beginTransaction();
    const nuevo = accion === 'aceptar' ? 'aceptada' : 'rechazada';
    await conn.query(
      'UPDATE solicitudes_empleo SET estado = ?, respondida_at = NOW() WHERE id = ?', [nuevo, sol.id]
    );
    if (accion === 'aceptar') {
      // El empleado pasa a trabajar en esta veterinaria
      await conn.query(
        'UPDATE empleados SET veterinaria_id = ?, cargo = COALESCE(?, cargo) WHERE id = ?',
        [sol.veterinaria_id, sol.cargo, sol.empleado_id]
      );
      // Sus otras solicitudes pendientes quedan sin efecto
      await conn.query(
        `UPDATE solicitudes_empleo SET estado = 'rechazada', respondida_at = NOW()
          WHERE empleado_id = ? AND estado = 'pendiente' AND id <> ?`,
        [sol.empleado_id, sol.id]
      );
    }
    await conn.commit();
    res.json({ ok: true, msg: accion === 'aceptar' ? 'Empleado aceptado' : 'Solicitud rechazada' });
  } catch (e) {
    await conn.rollback().catch(() => {});
    fallo(res, e);
  } finally {
    conn.release();
  }
};

// PUT /api/panel/citas/:id { estado: 'confirmada' | 'atendida' | 'cancelada' }
const estadoCita = async (req, res) => {
  try {
    const { estado } = req.body;
    if (!['confirmada', 'atendida', 'cancelada'].includes(estado)) {
      return res.status(400).json({ ok: false, msg: 'Estado no válido' });
    }
    const [r] = await pool.query(
      `UPDATE citas c
         JOIN veterinarias v ON v.id = c.veterinaria_id
          SET c.estado = ?
        WHERE c.id = ? AND v.veterinario_id = ?`,
      [estado, req.params.id, req.user.veterinarioId]
    );
    if (!r.affectedRows) return res.status(404).json({ ok: false, msg: 'Esa cita no es de tus veterinarias' });
    res.json({ ok: true, msg: 'Cita actualizada' });
  } catch (e) {
    fallo(res, e);
  }
};
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

module.exports = {
  veterinarias, crearVeterinaria, citas, consultas, inventario, empleados,
  solicitudes, responderSolicitud, estadoCita,
};
