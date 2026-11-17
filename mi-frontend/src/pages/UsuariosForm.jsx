import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { obtener, crear, actualizar } from '../services/usuarios';

export default function UsuariosForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', age: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) obtener(id).then((p) => setForm({ name: p.name, email: p.email, age: p.age }));
  }, [id]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (id) await actualizar(id, form);
      else await crear(form);
      navigate('/usuarios');
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo guardar el usuario. Inténtalo de nuevo.');
    }
  };

  return (
    <>
      <div className="page-head"><h1>{id ? 'Editar usuario' : 'Nuevo usuario'}</h1></div>
      <form className="card narrow form" style={{ marginTop: 0 }} onSubmit={onSubmit}>
        {error && <p className="alert" role="alert">{error}</p>}
        <div className="field">
          <label htmlFor="name">Nombre</label>
          <input id="name" name="name" value={form.name} onChange={onChange} required />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={onChange} required />
        </div>
        <div className="field">
          <label htmlFor="age">Edad</label>
          <input id="age" name="age" type="number" min="0" value={form.age} onChange={onChange} required />
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit">{id ? 'Guardar cambios' : 'Crear usuario'}</button>
          <button className="btn btn-ghost" type="button" onClick={() => navigate('/usuarios')}>Cancelar</button>
        </div>
      </form>
    </>
  );
}
