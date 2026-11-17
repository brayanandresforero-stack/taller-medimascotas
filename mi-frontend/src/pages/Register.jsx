import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { registrar, mensajeDeError } from '../services/auth';
import { listarVeterinarias } from '../services/veterinarias';
import AuthLayout from '../components/AuthLayout';
import TipoCuenta from '../components/TipoCuenta';

const VACIO = {
  nombre: '', email: '', password: '',
  cargo: '', veterinaria_id: '',
  tarjeta_profesional: '', titulo: '', especialidad: '',
  vet_nombre: '', direccion: '', barrio: '', telefono: '', horario: '',
};

export default function Register() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const inicial = ['empleado', 'veterinario'].includes(params.get('tipo')) ? params.get('tipo') : 'usuario';
  const [tipo, setTipo] = useState(inicial);
  const [form, setForm] = useState(VACIO);
  const [veterinarias, setVeterinarias] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (tipo !== 'empleado' || veterinarias.length) return;
    listarVeterinarias().then(setVeterinarias).catch(() => setError('No se pudo cargar la lista de veterinarias.'));
  }, [tipo, veterinarias.length]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const base = { tipo, nombre: form.nombre, email: form.email, password: form.password };
    let datos = base;
    if (tipo === 'empleado') {
      datos = { ...base, cargo: form.cargo, veterinaria_id: form.veterinaria_id };
    } else if (tipo === 'veterinario') {
      datos = {
        ...base,
        tarjeta_profesional: form.tarjeta_profesional,
        titulo: form.titulo,
        especialidad: form.especialidad,
        veterinaria: {
          nombre: form.vet_nombre, direccion: form.direccion, barrio: form.barrio,
          telefono: form.telefono, horario: form.horario,
        },
      };
    }
    try {
      await registrar(datos);
      navigate(tipo === 'usuario' ? '/login' : '/login?tipo=empleado');
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo crear la cuenta.'));
    }
  };

  const campo = (id, etiqueta, extra = {}) => (
    <div className="field">
      <label htmlFor={id}>{etiqueta}</label>
      <input id={id} name={id} value={form[id]} onChange={onChange} {...extra} />
    </div>
  );

  return (
    <AuthLayout title="Crear cuenta" subtitle="Elige cómo vas a usar Taller Masc.">
      <form className="form" onSubmit={onSubmit}>
        {error && <p className="alert" role="alert">{error}</p>}
        <TipoCuenta value={tipo} onChange={(e) => setTipo(e.target.value)} />

        {campo('nombre', 'Nombre', { required: true })}
        {campo('email', 'Correo', { type: 'email', required: true })}
        {campo('password', 'Contraseña', { type: 'password', minLength: 6, required: true })}

        {tipo === 'empleado' && (
          <>
            <div className="field">
              <label htmlFor="veterinaria_id">Veterinaria donde trabajas</label>
              <select id="veterinaria_id" name="veterinaria_id" value={form.veterinaria_id} onChange={onChange} required>
                <option value="">Elige una veterinaria</option>
                {veterinarias.map((v) => (
                  <option key={v.id} value={v.id}>{v.nombre}{v.direccion ? ` — ${v.direccion}` : ''}</option>
                ))}
              </select>
              {veterinarias.length === 0 && <span className="hint">Aún no hay veterinarias registradas.</span>}
            </div>
            {campo('cargo', 'Cargo', { placeholder: 'Por ejemplo, auxiliar', required: true })}
          </>
        )}

        {tipo === 'veterinario' && (
          <>
            <h2 className="subtitulo">Datos profesionales</h2>
            {campo('tarjeta_profesional', 'Tarjeta profesional', { required: true })}
            {campo('titulo', 'Título')}
            {campo('especialidad', 'Especialidad')}
            <h2 className="subtitulo">Tu veterinaria</h2>
            {campo('vet_nombre', 'Nombre de la veterinaria', { required: true })}
            {campo('direccion', 'Dirección', { required: true })}
            {campo('barrio', 'Barrio')}
            {campo('telefono', 'Teléfono')}
            {campo('horario', 'Horario', { placeholder: 'Lunes a viernes, 8:00 a 18:00' })}
          </>
        )}

        <button className="btn btn-primary" type="submit">Crear cuenta</button>
      </form>
      <p className="auth-alt muted">¿Ya tienes cuenta? <Link to={tipo === 'usuario' ? '/login' : '/login?tipo=empleado'}>Iniciar sesión</Link></p>
    </AuthLayout>
  );
}
