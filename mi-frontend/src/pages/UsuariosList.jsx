import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listar, eliminar } from '../services/usuarios';

export default function UsuariosList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listar()
      .then(setItems)
      .catch(() => setError('No se pudo conectar con la API. Revisa que el servidor esté encendido y que CORS esté habilitado.'))
      .finally(() => setLoading(false));
  }, []);

  const borrar = async (id) => {
    if (!window.confirm('¿Eliminar este usuario?')) return;
    await eliminar(id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) return <p className="muted">Cargando usuarios…</p>;
  if (error) return <p className="alert" role="alert">{error}</p>;

  return (
    <>
      <div className="page-head">
        <h1>Usuarios</h1>
        <Link className="btn btn-primary" to="/usuarios/nuevo">Nuevo usuario</Link>
      </div>
      <div className="table-wrap">
        {items.length === 0 ? (
          <p className="empty">Aún no hay usuarios. Crea el primero con “Nuevo usuario”.</p>
        ) : (
          <table>
            <thead>
              <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Edad</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.email}</td>
                  <td>{p.age}</td>
                  <td>
                    <div className="row-actions">
                      <Link className="btn btn-ghost btn-sm" to={`/usuarios/${p.id}/editar`}>Editar</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => borrar(p.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
