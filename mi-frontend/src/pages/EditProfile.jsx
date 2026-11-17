import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { actualizarPerfil, guardarFoto, mensajeDeError } from '../services/auth';

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const esEmpleado = user.tipo === 'empleado';
  const [form, setForm] = useState({ nombre: user.nombre || '', email: user.email || '', cargo: user.cargo || '', password: '' });
  const [error, setError] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fotoOk, setFotoOk] = useState('');
  const [fotoError, setFotoError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const elegirFoto = (e) => {
    const f = e.target.files[0];
    setFotoOk('');
    setFotoError('');
    if (!f) return;
    setArchivo(f);
    setPreview(URL.createObjectURL(f));
  };

  const subirFoto = async () => {
    setFotoError('');
    try {
      setUser(await guardarFoto(archivo));
      setArchivo(null);
      setPreview(null);
      setFotoOk('Foto actualizada');
    } catch {
      setFotoError('No se pudo guardar la foto. Prueba con otra imagen.');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Solo se envían los campos que el backend actualiza para cada tipo de cuenta
      const datos = esEmpleado
        ? { nombre: form.nombre, cargo: form.cargo, ...(form.password && { password: form.password }) }
        : { nombre: form.nombre, email: form.email };
      setUser(await actualizarPerfil(datos));
      navigate('/perfil');
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudieron guardar los cambios. Inténtalo de nuevo.'));
    }
  };

  const imagen = preview || user.fotoUrl;

  return (
    <>
      <div className="page-head"><h1>Editar perfil</h1></div>

      <section className="card narrow">
        <h2>Foto de perfil</h2>
        <div className="photo-box" style={{ marginTop: 16 }}>
          <div className="avatar lg">
            {imagen ? <img src={imagen} alt="Foto de perfil" /> : user.nombre?.[0]?.toUpperCase()}
          </div>
          <div className="field">
            <input type="file" accept="image/*" onChange={elegirFoto} aria-label="Elegir foto" />
            <span className="hint">La foto se guarda solo en este navegador.</span>
          </div>
        </div>
        {fotoError && <p className="alert" role="alert" style={{ marginTop: 16 }}>{fotoError}</p>}
        {fotoOk && <p className="alert ok" role="status" style={{ marginTop: 16 }}>{fotoOk}</p>}
        <div className="form-actions" style={{ marginTop: 16 }}>
          <button className="btn btn-primary" type="button" disabled={!archivo} onClick={subirFoto}>Guardar foto</button>
        </div>
      </section>

      <form className="card narrow form" onSubmit={onSubmit}>
        <h2>Datos de la cuenta</h2>
        {error && <p className="alert" role="alert">{error}</p>}
        <div className="field">
          <label htmlFor="nombre">Nombre</label>
          <input id="nombre" name="nombre" value={form.nombre} onChange={onChange} required />
        </div>
        <div className="field">
          <label htmlFor="email">Correo</label>
          <input id="email" name="email" type="email" value={form.email} onChange={onChange}
                 readOnly={esEmpleado} required={!esEmpleado} />
          {esEmpleado && <span className="hint">El correo de un empleado no se puede cambiar desde aquí.</span>}
        </div>
        {esEmpleado && (
          <>
            <div className="field">
              <label htmlFor="cargo">Cargo</label>
              <input id="cargo" name="cargo" value={form.cargo} onChange={onChange} required />
            </div>
            <div className="field">
              <label htmlFor="password">Nueva contraseña</label>
              <input id="password" name="password" type="password" minLength={6} value={form.password} onChange={onChange} />
              <span className="hint">Déjala vacía para conservar la actual.</span>
            </div>
          </>
        )}
        <div className="form-actions">
          <button className="btn btn-primary" type="submit">Guardar cambios</button>
          <button className="btn btn-ghost" type="button" onClick={() => navigate('/perfil')}>Cancelar</button>
        </div>
      </form>
    </>
  );
}
