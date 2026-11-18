// Lo que ve y hace un usuario (dueño de mascotas): sus mascotas, sus citas y su historial
const pool = require('../config/db');

const fallo = (res, e) => {
  console.error(e);
  res.status(500).json({ ok: false, msg: 'Error del servidor' });
};

// "2026-11-20T09:30" (input datetime-local) → "2026-11-20 09:30:00"
const aFechaSql = (valor) => {
  const m = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/.exec(String(valor || ''));
  return m ? `${m[1]} ${m[2]}:00` : null;
};

// ───────── Mascotas ─────────
const mascotas = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT m.id, m.nombre, e.especie, e.raza, m.sexo,
              DATE_FORMAT(m.fecha_nacimiento, '%Y-%m-%d') AS fecha_nacimiento, m.color, m.peso
         FROM mascotas m
         LEFT JOIN especies e ON e.id = COALESCE(m.raza_id, m.especie_id)
        WHERE m.usuario_id = ?
        ORDER BY m.nombre`,
      [req.user.id]
    );
    res.json({ ok: true, data: rows });
  } catch (e) {
    fallo(res, e);
  }
};

const crearMascota = async (req, res) => {
  try {
    const { nombre, especie_id, sexo, fecha_nacimiento, color } = req.body;
    if (!nombre || !especie_id) {
      return res.status(400).json({ ok: false, msg: 'El nombre y la especie son obligatorios' });
    }
    const [esp] = await pool.query('SELECT id FROM especies WHERE id = ?', [especie_id]);
    if (!esp.length) return res.status(400).json({ ok: false, msg: 'La especie elegida no existe' });

    const [r] = await pool.query(
      `INSERT INTO mascotas (usuario_id, nombre, especie_id, raza_id, sexo, fecha_nacimiento, color, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, '1')`,
      [req.user.id, nombre, especie_id, especie_id,
       ['macho', 'hembra'].includes(sexo) ? sexo : null, fecha_nacimiento || null, color || null]
    );
    res.status(201).json({ ok: true, data: { id: r.insertId, nombre } });
  } catch (e) {
    fallo(res, e);
  }
};

// ───────── Citas ─────────
const citas = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.id, DATE_FORMAT(c.fecha_hora, '%Y-%m-%d %H:%i') AS fecha_hora, c.estado, c.motivo,
              m.nombre AS mascota, v.nombre AS veterinaria, v.direccion, v.telefono, c.observaciones
         FROM citas c
         JOIN mascotas m     ON m.id = c.mascota_id
         JOIN veterinarias v ON v.id = c.veterinaria_id
        WHERE m.usuario_id = ?
        ORDER BY c.fecha_hora DESC`,
      [req.user.id]
    );
    res.json({ ok: true, data: rows });
  } catch (e) {
    fallo(res, e);
  }
};

const crearCita = async (req, res) => {
  try {
    const { veterinaria_id, mascota_id, motivo } = req.body;
    const fecha = aFechaSql(req.body.fecha_hora);
    if (!veterinaria_id || !mascota_id || !fecha) {
      return res.status(400).json({ ok: false, msg: 'Elige la veterinaria, la mascota y la fecha' });
    }
    // Margen de un día: el servidor está en UTC y el usuario escribe su hora local
    if (new Date(`${fecha.replace(' ', 'T')}Z`).getTime() < Date.now() - 24 * 3600 * 1000) {
      return res.status(400).json({ ok: false, msg: 'La fecha de la cita ya pasó' });
    }

    const [masc] = await pool.query(
      'SELECT id FROM mascotas WHERE id = ? AND usuario_id = ?', [mascota_id, req.user.id]
    );
    if (!masc.length) return res.status(403).json({ ok: false, msg: 'Esa mascota no es tuya' });

    const [vet] = await pool.query('SELECT id FROM veterinarias WHERE id = ?', [veterinaria_id]);
    if (!vet.length) return res.status(400).json({ ok: false, msg: 'La veterinaria elegida no existe' });

    const [ocupada] = await pool.query(
      `SELECT id FROM citas
        WHERE veterinaria_id = ? AND fecha_hora = ? AND estado IN ('pendiente', 'confirmada')`,
      [veterinaria_id, fecha]
    );
    if (ocupada.length) {
      return res.status(409).json({ ok: false, msg: 'Esa hora ya está ocupada en la veterinaria. Elige otra.' });
    }

    const [r] = await pool.query(
      `INSERT INTO citas (veterinaria_id, mascota_id, fecha_hora, estado, motivo)
       VALUES (?, ?, ?, 'pendiente', ?)`,
      [veterinaria_id, mascota_id, fecha, motivo || null]
    );
    res.status(201).json({ ok: true, data: { id: r.insertId } });
  } catch (e) {
    fallo(res, e);
  }
};

const cancelarCita = async (req, res) => {
  try {
    const [r] = await pool.query(
      `UPDATE citas c
         JOIN mascotas m ON m.id = c.mascota_id
          SET c.estado = 'cancelada', c.observaciones = 'Cancelada por el cliente'
        WHERE c.id = ? AND m.usuario_id = ? AND c.estado IN ('pendiente', 'confirmada')`,
      [req.params.id, req.user.id]
    );
    if (!r.affectedRows) {
      return res.status(404).json({ ok: false, msg: 'No encontramos una cita tuya que se pueda cancelar' });
    }
    res.json({ ok: true, msg: 'Cita cancelada' });
  } catch (e) {
    fallo(res, e);
  }
};

// ───────── Historial de consultas ─────────
const consultas = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT co.id, DATE_FORMAT(co.fecha, '%Y-%m-%d') AS fecha, m.nombre AS mascota,
              v.nombre AS veterinaria, em.nombre AS veterinario,
              co.motivo, co.diagnostico, co.tratamiento, co.peso, co.temperatura, co.observaciones
         FROM consultas co
         JOIN citas c          ON c.id = co.cita_id
         JOIN mascotas m       ON m.id = c.mascota_id
         JOIN veterinarias v   ON v.id = co.veterinaria_id
         LEFT JOIN veterinarios vt ON vt.id = co.veterinario_id
         LEFT JOIN empleados em    ON em.id = vt.empleado_id
        WHERE m.usuario_id = ?
        ORDER BY co.fecha DESC, co.id DESC`,
      [req.user.id]
    );
    res.json({ ok: true, data: rows });
  } catch (e) {
    fallo(res, e);
  }
};

module.exports = { mascotas, crearMascota, citas, crearCita, cancelarCita, consultas };
