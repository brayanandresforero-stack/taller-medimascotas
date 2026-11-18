import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listarVeterinarias } from '../services/veterinarias';
import {
  misMascotas, crearMascota, misCitas, agendarCita, cancelarCita, misConsultas, listarEspecies,
} from '../services/mis';
import { mensajeDeError } from '../services/auth';
import Tabla from '../components/Tabla';

const TABS = [['citas', 'Mis citas'], ['consultas', 'Historial de consultas'], ['mascotas', 'Mis mascotas']];
const CITA = { veterinaria_id: '', mascota_id: '', fecha_hora: '', motivo: '' };
const MASCOTA = { nombre: '', especie_id: '', sexo: '', fecha_nacimiento: '', color: '' };

// Fecha y hora local actual en el formato de <input type="datetime-local">
const ahoraLocal = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

export default function MisCitas() {
  const [params] = useSearchParams();
  const [vets, setVets] = useState([]);
  const [especies, setEspecies] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [citas, setCitas] = useState([]);
  const [consultas, setConsultas] = useState([]);
  const [tab, setTab] = useState('citas');
  const [cita, setCita] = useState({ ...CITA, veterinaria_id: params.get('veterinaria') || '' });
  const [mascota, setMascota] = useState(MASCOTA);
  const [nuevaMascota, setNuevaMascota] = useState(false);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [cargando, setCargando] = useState(true);

  const recargar = () =>
    Promise.all([misMascotas(), misCitas(), misConsultas()]).then(([m, c, co]) => {
      setMascotas(m);
      setCitas(c);
      setConsultas(co);
      if (!m.length) setNuevaMascota(true);
    });

  useEffect(() => {
    Promise.all([listarVeterinarias(), listarEspecies(), recargar()])
      .then(([v, e]) => { setVets(v); setEspecies(e); })
      .catch((e) => setError(mensajeDeError(e, 'No se pudieron cargar tus datos.')))
      .finally(() => setCargando(false));
  }, []);

  const guardarMascota = async (e) => {
    e.preventDefault();
    setError(''); setAviso('');
    try {
      const m = await crearMascota(mascota);
      await recargar();
      setCita((c) => ({ ...c, mascota_id: String(m.id) }));
      setMascota(MASCOTA);
      setNuevaMascota(false);
      setAviso(`${m.nombre} quedó registrada. Ya puedes agendarle una cita.`);
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo registrar la mascota.'));
    }
  };

  const agendar = async (e) => {
    e.preventDefault();
    setError(''); setAviso('');
    try {
      await agendarCita(cita);
      await recargar();
      setCita({ ...CITA, veterinaria_id: cita.veterinaria_id });
      setTab('citas');
      setAviso('Cita agendada. La veterinaria la verá como pendiente hasta confirmarla.');
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo agendar la cita.'));
    }
  };

  const cancelar = async (id) => {
    if (!window.confirm('¿Cancelar esta cita?')) return;
    setError(''); setAviso('');
    try {
      await cancelarCita(id);
      await recargar();
      setAviso('Cita cancelada.');
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo cancelar la cita.'));
    }
  };

  const onCita = (e) => setCita({ ...cita, [e.target.name]: e.target.value });
  const onMascota = (e) => setMascota({ ...mascota, [e.target.name]: e.target.value });

  if (cargando) return <p className="muted">Cargando…</p>;

  return (
    <>
      <div className="page-head"><h1>Mis citas</h1></div>

      {error && <p className="alert" role="alert">{error}</p>}
      {aviso && <p className="alert ok" role="status">{aviso}</p>}

      <div className="dos-columnas">
        <form className="card form" onSubmit={agendar}>
          <h2>Agendar una cita</h2>
          <div className="field">
            <label htmlFor="veterinaria_id">Veterinaria</label>
            <select id="veterinaria_id" name="veterinaria_id" value={cita.veterinaria_id} onChange={onCita} required>
              <option value="">Elige una veterinaria</option>
              {vets.map((v) => (
                <option key={v.id} value={v.id}>{v.nombre}{v.barrio ? ` — ${v.barrio}` : ''}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="mascota_id">Mascota</label>
            <select id="mascota_id" name="mascota_id" value={cita.mascota_id} onChange={onCita} required>
              <option value="">{mascotas.length ? 'Elige tu mascota' : 'Primero registra una mascota'}</option>
              {mascotas.map((m) => (
                <option key={m.id} value={m.id}>{m.nombre}{m.especie ? ` (${m.especie})` : ''}</option>
              ))}
            </select>
            {!nuevaMascota && (
              <button type="button" className="link-btn" onClick={() => setNuevaMascota(true)}>
                + Registrar otra mascota
              </button>
            )}
          </div>
          <div className="field">
            <label htmlFor="fecha_hora">Fecha y hora</label>
            <input id="fecha_hora" name="fecha_hora" type="datetime-local" min={ahoraLocal()}
                   value={cita.fecha_hora} onChange={onCita} required />
          </div>
          <div className="field">
            <label htmlFor="motivo">Motivo de la consulta</label>
            <input id="motivo" name="motivo" value={cita.motivo} onChange={onCita}
                   placeholder="Por ejemplo, vacunación o control" required />
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={!mascotas.length}>Agendar cita</button>
          </div>
        </form>

        {nuevaMascota && (
          <form className="card form" onSubmit={guardarMascota}>
            <h2>Registrar mascota</h2>
            <div className="field">
              <label htmlFor="m-nombre">Nombre</label>
              <input id="m-nombre" name="nombre" value={mascota.nombre} onChange={onMascota} required />
            </div>
            <div className="field">
              <label htmlFor="m-especie">Especie y raza</label>
              <select id="m-especie" name="especie_id" value={mascota.especie_id} onChange={onMascota} required>
                <option value="">Elige una opción</option>
                {especies.map((e) => (
                  <option key={e.id} value={e.id}>{e.especie}{e.raza ? ` — ${e.raza}` : ''}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="m-sexo">Sexo</label>
              <select id="m-sexo" name="sexo" value={mascota.sexo} onChange={onMascota}>
                <option value="">Sin especificar</option>
                <option value="macho">Macho</option>
                <option value="hembra">Hembra</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="m-nacimiento">Fecha de nacimiento</label>
              <input id="m-nacimiento" name="fecha_nacimiento" type="date" value={mascota.fecha_nacimiento} onChange={onMascota} />
            </div>
            <div className="field">
              <label htmlFor="m-color">Color</label>
              <input id="m-color" name="color" value={mascota.color} onChange={onMascota} />
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" type="submit">Guardar mascota</button>
              {mascotas.length > 0 && (
                <button className="btn btn-ghost" type="button" onClick={() => setNuevaMascota(false)}>Cancelar</button>
              )}
            </div>
          </form>
        )}
      </div>

      <div className="tabs" role="tablist">
        {TABS.map(([id, texto]) => (
          <button key={id} role="tab" aria-selected={tab === id} className={`tab ${tab === id ? 'on' : ''}`}
                  onClick={() => setTab(id)}>
            {texto}
          </button>
        ))}
      </div>

      {tab === 'citas' && (
        <Tabla
          filas={citas}
          vacio="Aún no tienes citas. Agenda la primera con el formulario de arriba."
          ocultar={['id', 'direccion', 'telefono']}
          acciones={(c) => ['pendiente', 'confirmada'].includes(c.estado) && (
            <button className="btn btn-danger btn-sm" onClick={() => cancelar(c.id)}>Cancelar</button>
          )}
        />
      )}
      {tab === 'consultas' && (
        <Tabla filas={consultas} vacio="Todavía no hay consultas registradas para tus mascotas." ocultar={['id']} />
      )}
      {tab === 'mascotas' && (
        <Tabla filas={mascotas} vacio="No tienes mascotas registradas." ocultar={['id']} />
      )}
    </>
  );
}
