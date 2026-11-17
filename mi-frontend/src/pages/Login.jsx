import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mensajeDeError } from '../services/auth';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const tipo = params.get('tipo') === 'empleado' ? 'empleado' : 'usuario';
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const u = await login(form.email, form.password, tipo);
      navigate(u?.rol === 'veterinario' ? '/panel' : '/perfil');
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo iniciar sesión.'));
    }
  };

  const esEmpleado = tipo === 'empleado';
  return (
    <AuthLayout
      title={esEmpleado ? 'Acceso de empleados y veterinarios' : 'Iniciar sesión'}
      subtitle={esEmpleado ? 'Entra con el correo con el que te registraste.' : 'Entra para gestionar la clínica.'}
    >
      <form className="form" onSubmit={onSubmit}>
        {error && <p className="alert" role="alert">{error}</p>}
        <div className="field">
          <label htmlFor="email">Correo</label>
          <input id="email" name="email" type="email" value={form.email} onChange={onChange} required />
        </div>
        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input id="password" name="password" type="password" value={form.password} onChange={onChange} required />
        </div>
        <button className="btn btn-primary" type="submit">Iniciar sesión</button>
      </form>
      <p className="auth-alt muted">
        ¿No tienes cuenta? <Link to={esEmpleado ? '/register?tipo=empleado' : '/register'}>Crear cuenta</Link>
      </p>
    </AuthLayout>
  );
}
