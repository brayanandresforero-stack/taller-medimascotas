import { useState, useEffect, useCallback }
  from 'react';
import * as svc from '../services/usuarios.service';
import usuariosForm from '../components/usuariosForm';
import usuariosList from '../components/usuariosList';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      setUsuarios(await svc.getUsuarios());
    } catch { setError('Error al cargar'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar?')) return;
    await svc.deleteUsuario(id);
    setUsuarios(u => u.filter(x => x.id !== id));
  };

  return (
    <div>
      <h1>Usuarios</h1>
      <usuariosForm onCreated={cargar} />
      {error && <p style={{color:'red'}}>{error}</p>}
      {loading
        ? <p>Cargando...</p>
        : <usuariosList
            usuarios={usuarios}
            onDelete={handleDelete}
            onUpdated={cargar}
          />}
    </div>
  );
}