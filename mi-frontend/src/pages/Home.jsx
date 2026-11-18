import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NearbyMap from '../components/NearbyMap';

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="home">
      {!user && (
        <header className="home-top">
          <span className="brand">Taller Masc</span>
        </header>
      )}

      <section className="home-hero">
        <div>
          <h1>Atención veterinaria, cerca de ti</h1>
          <p className="muted lead">
            Encuentra la veterinaria más próxima a donde estás y entra a tu cuenta para ver la historia clínica de tu mascota.
          </p>
        </div>

        {user ? (
          <div className="acceso">
            <article className="acceso-card">
              <h2>Hola, {user.nombre}</h2>
              <p className="muted">Ya iniciaste sesión.</p>
              <div className="form-actions">
                {user.rol === 'usuario' && <Link className="btn btn-primary" to="/citas">Agendar una cita</Link>}
                {user.rol === 'empleado' && <Link className="btn btn-primary" to="/trabajo">Ir a mi trabajo</Link>}
                {user.rol === 'veterinario' && <Link className="btn btn-primary" to="/panel">Ir a mi veterinaria</Link>}
                <Link className="btn btn-ghost" to="/perfil">Mi perfil</Link>
              </div>
            </article>
          </div>
        ) : (
          <div className="acceso">
            <article className="acceso-card">
              <h2>Soy usuario</h2>
              <p className="muted">Consulta y administra los datos de tu cuenta.</p>
              <div className="form-actions">
                <Link className="btn btn-primary" to="/login">Iniciar sesión</Link>
                <Link className="btn btn-ghost" to="/register">Crear cuenta</Link>
              </div>
            </article>
            <article className="acceso-card">
              <h2>Soy empleado o veterinario</h2>
              <p className="muted">Gestiona tu veterinaria o únete a una.</p>
              <div className="form-actions">
                <Link className="btn btn-primary" to="/login?tipo=empleado">Iniciar sesión</Link>
                <Link className="btn btn-ghost" to="/register?tipo=veterinario">Registrarme</Link>
              </div>
            </article>
          </div>
        )}
      </section>

      <NearbyMap />
    </div>
  );
}
