const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const db      = require('../config/db');

const register = async (req, res) => {
  const { nombre, email, password } = req.body;
// 1. Verificar si ya existe
  const [rows] = await db.query(
    'SELECT id FROM usuarios WHERE email = ?', [email]
  );
  if (rows.length) {
    return res.status(409).json({ error: 'Email ya registrado' });
  }
// 2. Hashear la contraseña (saltRounds = 10)
  const hash = await bcrypt.hash(password, 10);
  // 3. Guardar en la DB
  const [result] = await db.query(
    'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
    [nombre, email, hash]
  );
  // 4. Generar token y responder
  const token = jwt.sign(
    { id: result.insertId, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  res.status(201).json({ token });
};
//generar token de autenticación para el usuario
const login = async (req, res) => {
  const { email, password } = req.body;
  const duenomascotaModel = await duenomascotaModel.findByEmail(email);
  if (!duenomascotaModel) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  const valid = await bcrypt.compare(password, duenomascotaModel.password);
  if (!valid) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
   const token = jwt.sign(
    { id: duenomascotaModel.id, email: duenomascotaModel.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

   res.json({ token, usuario: { id: duenomascotaModel.id, email: duenomascotaModel.email } });
   
};
module.exports = { login,
  register
 };