// Debe usarse después de verificarToken. Solo deja pasar a veterinarios.
function soloVeterinario(req, res, next) {
  if (req.user?.rol === 'veterinario' && req.user.veterinarioId) return next();
  res.status(403).json({ error: 'Solo los veterinarios pueden acceder a esta sección' });
}

module.exports = { soloVeterinario };
