// Deben usarse después de verificarToken.

// Solo deja pasar a veterinarios.
function soloVeterinario(req, res, next) {
  if (req.user?.rol === 'veterinario' && req.user.veterinarioId) return next();
  res.status(403).json({ error: 'Solo los veterinarios pueden acceder a esta sección' });
}

// Solo deja pasar a cuentas de usuario (dueños de mascotas).
function soloUsuario(req, res, next) {
  if (req.user?.rol === 'usuario') return next();
  res.status(403).json({ error: 'Esta sección es solo para cuentas de usuario' });
}

// Solo deja pasar a empleados que no son veterinarios.
function soloEmpleado(req, res, next) {
  if (req.user?.tipo === 'empleado' && req.user.rol === 'empleado') return next();
  res.status(403).json({ error: 'Esta sección es solo para empleados' });
}

module.exports = { soloVeterinario, soloUsuario, soloEmpleado };
