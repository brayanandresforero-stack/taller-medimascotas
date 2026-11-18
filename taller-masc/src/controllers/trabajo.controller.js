// Lo que ve y hace un empleado: su veterinaria, sus solicitudes para unirse y las citas de su veterinaria
const pool = require('../config/db');

const fallo = (res, e) => {
  console.error(e);
  res.status(500).json({ ok: false, msg: 'Error del servidor' });
};

const suVeterinariaId = async (empleadoId) => {
  const [rows] = await pool.query('SELECT veterinaria_id FROM empleados WHERE id = ?', [empleadoId]);
  return rows[0]?.veterinaria_id ?? null;
};

// GET /api/trabajo → su veterinaria (o null) y sus solicitudes
const estado = async (req, res) => {
  try {
    const [emp] = await pool.query(
      `SELECT e.cargo, v.id, v.nombre, v.direccion, v.barrio, v.telefono, v.horario
         FROM empleados e
         LEFT JOIN veterinarias v ON v.id = e.veterinaria_id
        WHERE e.id = ?`,
      [req.user.id]
    );
    const fila = emp[0] || {};
    const veterinaria = fila.id ? {
      id: fila.id, nombre: fila.nombre, direccion: fila.direccion, barrio: fila.barrio,
      telefono: fila.telefono, horario: fila.horario, cargo: fila.cargo,
    } : null;

    const [solicitudes] = await pool.query(
      `SELECT s.id, s.veterinaria_id, v.nombre AS veterinaria, s.cargo, s.estado,
              DATE_FORMAT(s.created_at, '%Y-%m-%d %H:%i') AS enviada
         FROM solicitudes_empleo s
         JOIN veterinarias v ON v.id = s.veterinaria_id
        WHERE s.empleado_id = ?
        ORDER BY s.id DESC`,
      [req.user.id]
    );
    res.json({ ok: true, data: { veterinaria, solicitudes } });
  } catch (e) {
    fallo(res, e);
  }
};

// POST /api/trabajo/solicitudes { veterinaria_id, cargo }
const solicitar = async (req, res) => {
  try {
    const { veterinaria_id, cargo } = req.body;
    if (!veterinaria_id) return res.status(400).json({ ok: false, msg: 'Elige una veterinaria' });

    const [vet] = await pool.query('SELECT id FROM veterinarias WHERE id = ?', [veterinaria_id]);
    if (!vet.length) return res.status(400).json({ ok: false, msg: 'La veterinaria elegida no existe' });

    if (Number(await suVeterinariaId(req.user.id)) === Number(veterinaria_id)) {
      return res.status(409).json({ ok: false, msg: 'Ya trabajas en esa veterinaria' });
    }
    const [pend] = await pool.query(
      `SELECT id FROM solicitudes_empleo
        WHERE empleado_id = ? AND veterinaria_id = ? AND estado = 'pendiente'`,
      [req.user.id, veterinaria_id]
    );
    if (pend.length) {
      return res.status(409).json({ ok: false, msg: 'Ya tienes una solicitud pendiente en esa veterinaria' });
    }

    const [r] = await pool.query(
      'INSERT INTO solicitudes_empleo (empleado_id, veterinaria_id, cargo) VALUES (?, ?, ?)',
      [req.user.id, veterinaria_id, cargo || null]
    );
    res.status(201).json({ ok: true, data: { id: r.insertId } });
  } catch (e) {
    fallo(res, e);
  }
};

// DELETE /api/trabajo/solicitudes/:id → retira una solicitud pendiente
const retirar = async (req, res) => {
  try {
    const [r] = await pool.query(
      `DELETE FROM solicitudes_empleo WHERE id = ? AND empleado_id = ? AND estado = 'pendiente'`,
      [req.params.id, req.user.id]
    );
    if (!r.affectedRows) return res.status(404).json({ ok: false, msg: 'No hay una solicitud pendiente con ese id' });
    res.json({ ok: true, msg: 'Solicitud retirada' });
  } catch (e) {
    fallo(res, e);
  }
};

// GET /api/trabajo/citas → citas de la veterinaria donde trabaja
const citas = async (req, res) => {
  try {
    const vetId = await suVeterinariaId(req.user.id);
    if (!vetId) return res.json({ ok: true, data: [] });
    const [rows] = await pool.query(
      `SELECT c.id, DATE_FORMAT(c.fecha_hora, '%Y-%m-%d %H:%i') AS fecha_hora, c.estado,
              m.nombre AS mascota, u.nombre AS propietario, c.motivo
         FROM citas c
         LEFT JOIN mascotas m ON m.id = c.mascota_id
         LEFT JOIN usuarios u ON u.id = m.usuario_id
        WHERE c.veterinaria_id = ?
        ORDER BY c.fecha_hora DESC`,
      [vetId]
    );
    res.json({ ok: true, data: rows });
  } catch (e) {
    fallo(res, e);
  }
};

module.exports = { estado, solicitar, retirar, citas };
