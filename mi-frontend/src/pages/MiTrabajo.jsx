import { useEffect, useState } from 'react';
import { listarVeterinarias } from '../services/veterinarias';
import { miTrabajo, solicitarIngreso, retirarSolicitud, citasDeMiTrabajo } from '../services/trabajo';
import { mensajeDeError } from '../services/auth';
import Tabla, { Estado, valor } from '../components/Tabla';

const VACIA = { veterinaria_id: '', cargo: '' };

export default function MiTrabajo() {
  const [vets, setVets] = useState([]);
  const [trabajo, setTrabajo] = useState({ veterinaria: null, solicitudes: [] });
  const [citas, setCitas] = useState([]);
  const [form, setForm] = useState(VACIA);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [cargando, setCargando] = useState(true);

  const recargar = async () => {
    const t = await miTrabajo();
    setTrabajo(t);
    setCitas(t.veterinaria ? await citasDeMiTrabajo() : []);
  };

  useEffect(() => {
    Promise.all([listarVeterinarias().then(setVets), recargar()])
      .catch((e) => setError(mensajeDeError(e, 'No se pudo cargar tu información.')))
      .finally(() => setCargando(false));
  }, []);

  const pendientes = trabajo.solicitudes.filter((s) => s.estado === 'pendiente').map((s) => s.veterinaria_id);
  const disponibles = vets.filter((v) => v.id !== trabajo.veterinaria?.id && !pendientes.includes(v.id));

  const enviar = async (e) => {
    e.preventDefault();
    setError(''); setAviso('');
    try {
      await solicitarIngreso(form);
      await recargar();
      setForm(VACIA);
      setAviso('Solicitud enviada. El veterinario de esa veterinaria debe aceptarla.');
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo enviar la solicitud.'));
    }
  };

  const retirar = async (id) => {
    setError(''); setAviso('');
    try {
      await retirarSolicitud(id);
      await recargar();
      setAviso('Solicitud retirada.');
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo retirar la solicitud.'));
    }
  };

  if (cargando) return <p className="muted">Cargando…</p>;
  const v = trabajo.veterinaria;

  return (
    <>
      <div className="page-head"><h1>Mi trabajo</h1></div>

      {error && <p className="alert" role="alert">{error}</p>}
      {aviso && <p className="alert ok" role="status">{aviso}</p>}

      <div className="dos-columnas">
        <article className="card">
          {v ? (
            <>
              <p className="muted">Trabajas en</p>
              <h2>{v.nombre}</h2>
              <p className="muted">{[v.direccion, v.barrio].filter(Boolean).join(', ')}</p>
              <dl className="data">
                <dt>Cargo</dt><dd>{valor(v.cargo)}</dd>
                <dt>Teléfono</dt><dd>{valor(v.telefono)}</dd>
                <dt>Horario</dt><dd>{valor(v.horario)}</dd>
              </dl>
            </>
          ) : (
            <>
              <h2>Aún no perteneces a una veterinaria</h2>
              <p className="muted">Envía una solicitud. Cuando el veterinario la acepte, verás aquí tu veterinaria y sus citas.</p>
            </>
          )}
        </article>

        <form className="card form" onSubmit={enviar}>
          <h2>{v ? 'Cambiarme de veterinaria' : 'Unirme a una veterinaria'}</h2>
          <div className="field">
            <label htmlFor="veterinaria_id">Veterinaria</label>
            <select id="veterinaria_id" value={form.veterinaria_id} required
                    onChange={(e) => setForm({ ...form, veterinaria_id: e.target.value })}>
              <option value="">Elige una veterinaria</option>
              {disponibles.map((x) => (
                <option key={x.id} value={x.id}>{x.nombre}{x.barrio ? ` — ${x.barrio}` : ''}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="cargo">Cargo</label>
            <input id="cargo" value={form.cargo} placeholder="Por ejemplo, auxiliar" required
                   onChange={(e) => setForm({ ...form, cargo: e.target.value })} />
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit">Enviar solicitud</button>
          </div>
        </form>
      </div>

      <h2 className="seccion">Mis solicitudes</h2>
      {trabajo.solicitudes.length === 0 ? (
        <p className="empty">No has enviado solicitudes.</p>
      ) : (
        <ul className="solicitudes">
          {trabajo.solicitudes.map((s) => (
            <li key={s.id} className="card">
              <div>
                <strong>{s.veterinaria}</strong>
                <p className="muted">{s.cargo || 'Sin cargo'} · enviada {s.enviada}</p>
              </div>
              <div className="row-actions">
                <Estado valor={s.estado} />
                {s.estado === 'pendiente' && (
                  <button className="btn btn-ghost btn-sm" onClick={() => retirar(s.id)}>Retirar</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {v && (
        <>
          <h2 className="seccion">Citas de {v.nombre}</h2>
          <Tabla filas={citas} vacio="Esta veterinaria todavía no tiene citas." />
        </>
      )}
    </>
  );
}
