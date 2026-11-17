const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const db      = require('../config/db');

const firmar = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const fallo = (res, e) => {
  console.error(e);
  res.status(500).json({ error: 'Error del servidor' });
};

// ───────── Registro: usuario ─────────
const registrarUsuario = async (req, res) => {
  const { nombre, email, password } = req.body;

  const [rows] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
  if (rows.length) return res.status(409).json({ error: 'Email ya registrado' });

  const hash = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
    [nombre, email, hash]
  );
  const token = firmar({ id: result.insertId, email, tipo: 'usuario', rol: 'usuario' });
  res.status(201).json({ token });
};

// ───────── Registro: empleado de una veterinaria ─────────
const registrarEmpleado = async (req, res) => {
  const { nombre, email, password, cargo, veterinaria_id } = req.body;
  if (!veterinaria_id) return res.status(400).json({ error: 'Elige la veterinaria donde trabajas' });

  const [vtr] = await db.query('SELECT id FROM veterinarias WHERE id = ?', [veterinaria_id]);
  if (!vtr.length) return res.status(400).json({ error: 'La veterinaria elegida no existe' });

  const [dup] = await db.query('SELECT id FROM empleados WHERE email = ?', [email]);
  if (dup.length) return res.status(409).json({ error: 'Email ya registrado' });

  const hash = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    'INSERT INTO empleados (nombre, email, cargo, password, salario, veterinaria_id) VALUES (?, ?, ?, ?, 0, ?)',
    [nombre, email, cargo || 'Empleado', hash, veterinaria_id]
  );
  const token = firmar({ id: result.insertId, email, tipo: 'empleado', rol: 'empleado' });
  res.status(201).json({ token });
};

// ───────── Registro: veterinario + su veterinaria (todo o nada) ─────────
const registrarVeterinario = async (req, res) => {
  const { nombre, email, password, tarjeta_profesional, titulo, especialidad, veterinaria = {} } = req.body;
  if (!tarjeta_profesional) {
    return res.status(400).json({ error: 'La tarjeta profesional es obligatoria' });
  }
  if (!veterinaria.nombre || !veterinaria.direccion) {
    return res.status(400).json({ error: 'El nombre y la dirección de la veterinaria son obligatorios' });
  }

  const [dup] = await db.query('SELECT id FROM empleados WHERE email = ?', [email]);
  if (dup.length) return res.status(409).json({ error: 'Email ya registrado' });

  const hash = await bcrypt.hash(password, 10);
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [emp] = await conn.query(
      'INSERT INTO empleados (nombre, email, cargo, password, salario) VALUES (?, ?, ?, ?, 0)',
      [nombre, email, 'Veterinario', hash]
    );
    const [vet] = await conn.query(
      'INSERT INTO veterinarios (empleado_id, tarjeta_profesional, titulo, especialidad) VALUES (?, ?, ?, ?)',
      [emp.insertId, tarjeta_profesional, titulo || null, especialidad || null]
    );
    const [vtr] = await conn.query(
      'INSERT INTO veterinarias (veterinario_id, nombre, direccion, barrio, telefono, horario) VALUES (?, ?, ?, ?, ?, ?)',
      [vet.insertId, veterinaria.nombre, veterinaria.direccion,
       veterinaria.barrio || null, veterinaria.telefono || null, veterinaria.horario || null]
    );
    // El veterinario también trabaja en su propia veterinaria
    await conn.query('UPDATE empleados SET veterinaria_id = ? WHERE id = ?', [vtr.insertId, emp.insertId]);

    await conn.commit();
    const token = firmar({
      id: emp.insertId, email, tipo: 'empleado', rol: 'veterinario', veterinarioId: vet.insertId,
    });
    res.status(201).json({ token });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
};

const register = async (req, res) => {
  try {
    const { tipo = 'usuario', nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }
    if (tipo === 'usuario')     return await registrarUsuario(req, res);
    if (tipo === 'empleado')    return await registrarEmpleado(req, res);
    if (tipo === 'veterinario') return await registrarVeterinario(req, res);
    res.status(400).json({ error: 'Tipo de cuenta inválido' });
  } catch (e) {
    fallo(res, e);
  }
};

// ───────── Login ─────────
// tipo "usuario": tabla usuarios.
// tipo "empleado": tabla empleados; si además tiene fila en veterinarios, entra como veterinario.
const login = async (req, res) => {
  try {
    const { email, password, tipo = 'usuario' } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Escribe tu correo y contraseña' });

    if (tipo === 'usuario') {
      const [rows] = await db.query('SELECT id, email, password FROM usuarios WHERE email = ?', [email]);
      if (!rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });
      const user = rows[0];
      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }
      return res.json({ token: firmar({ id: user.id, email: user.email, tipo: 'usuario', rol: 'usuario' }) });
    }

    if (tipo === 'empleado') {
      const [rows] = await db.query('SELECT id, email, password FROM empleados WHERE email = ?', [email]);
      if (!rows.length) return res.status(404).json({ error: 'Empleado no encontrado' });
      const emp = rows[0];
      if (!(await bcrypt.compare(password, emp.password))) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }
      const [vet] = await db.query('SELECT id FROM veterinarios WHERE empleado_id = ?', [emp.id]);
      const payload = { id: emp.id, email: emp.email, tipo: 'empleado', rol: vet.length ? 'veterinario' : 'empleado' };
      if (vet.length) payload.veterinarioId = vet[0].id;
      return res.json({ token: firmar(payload) });
    }

    res.status(400).json({ error: 'Tipo de cuenta inválido' });
  } catch (e) {
    fallo(res, e);
  }
};

module.exports = { register, login };
