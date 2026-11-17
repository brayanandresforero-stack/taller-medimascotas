import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { obtenerVeterinaria } from '../services/veterinarias';

const ROLES = { usuario: 'Usuario', empleado: 'Empleado', veterinario: 'Veterinario' };

export default function Profile() {
  const { user } = useAuth();
  const esEmpleado = user.tipo === 'empleado';
  const [veterinaria, setVeterinaria] = useState(null);

  useEffect(() => {
    if (esEmpleado && user.veterinaria_id) {
      obtenerVeterinaria(user.veterinaria_id).then(setVeterinaria).catch(() => setVeterinaria(null));
    }
  }, [esEmpleado, user.veterinaria_id]);

  return (
    <>
      <div className="page-head">
        <h1>Mi perfil</h1>
        <div className="form-actions" style={{ marginTop: 0 }}>
          {user.rol === 'veterinario' && <Link className="btn btn-ghost" to="/panel">Mi veterinaria</Link>}
          <Link className="btn btn-primary" to="/perfil/editar">Editar perfil</Link>
        </div>
      </div>
      <section className="card">
        <div className="profile">
          <div className="avatar lg">
            {user.fotoUrl ? <img src={user.fotoUrl} alt="Foto de perfil" /> : user.nombre?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2>{user.nombre}</h2>
            <p className="muted">{user.email}</p>
            <span className="badge">{ROLES[user.rol] || 'Usuario'}</span>
          </div>
        </div>
        <dl className="data">
          <dt>ID</dt><dd>{user.id}</dd>
          <dt>Nombre</dt><dd>{user.nombre}</dd>
          <dt>Correo</dt><dd>{user.email}</dd>
          {esEmpleado && (
            <>
              <dt>Cargo</dt><dd>{user.cargo}</dd>
              <dt>Veterinaria</dt>
              <dd>
                {veterinaria
                  ? `${veterinaria.nombre}${veterinaria.direccion ? ` — ${veterinaria.direccion}` : ''}`
                  : 'Sin veterinaria asignada'}
              </dd>
            </>
          )}
        </dl>
      </section>
    </>
  );
}
