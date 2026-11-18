import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  misVeterinarias, crearVeterinaria, listarPanel, responderSolicitud, cambiarEstadoCita,
} from '../services/panel';
import { mensajeDeError } from '../services/auth';
import Tabla, { valor } from '../components/Tabla';

const TABS = [
  ['veterinarias', 'Mis veterinarias'],
  ['citas', 'Citas'],
  ['consultas', 'Consultas'],
  ['inventario', 'Inventario'],
  ['empleados', 'Empleados'],
  ['solicitudes', 'Solicitudes'],
];
const VACIAS = {
  citas: 'Aún no hay citas en esta veterinaria.',
  consultas: 'Aún no hay consultas en esta veterinaria.',
  inventario: 'Aún no hay productos en el inventario de esta veterinaria.',
  empleados: 'Todavía no se ha registrado ningún empleado en esta veterinaria.',
  solicitudes: 'Nadie ha pedido unirse a esta veterinaria todavía.',
};
const NUEVA = { nombre: '', direccion: '', barrio: '', telefono: '', horario: '' };

export default function Panel() {
  const { user } = useAuth();
  const [vets, setVets] = useState([]);
  const [sel, setSel] = useState(''); // '' = todas mis veterinarias
  const [tab, setTab] = useState('veterinarias');
  const [filas, setFilas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [nueva, setNueva] = useState(NUEVA);
  const [errorNueva, setErrorNueva] = useState('');
  const [aviso, setAviso] = useState('');
  const [refresco, setRefresco] = useState(0);

  useEffect(() => {
    misVeterinarias()
      .then(setVets)
      .catch((e) => setError(mensajeDeError(e, 'No se pudieron cargar tus veterinarias.')))
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    if (tab === 'veterinarias') return;
    setCargando(true);
    setError('');
    listarPanel(tab, sel)
      .then(setFilas)
      .catch((e) => { setFilas([]); setError(mensajeDeError(e, 'No se pudieron cargar los datos.')); })
      .finally(() => setCargando(false));
  }, [tab, sel, refresco]);

  const visibles = useMemo(() => {
    const base = tab === 'veterinarias' ? vets.filter((v) => !sel || String(v.id) === sel) : filas;
    const t = q.trim().toLowerCase();
    if (!t) return base;
    return base.filter((f) => Object.values(f).some((v) => String(v ?? '').toLowerCase().includes(t)));
  }, [tab, vets, filas, sel, q]);

  // Acciones sobre una fila: aceptar/rechazar solicitudes y cambiar el estado de una cita
  const accion = async (fn, texto) => {
    setError(''); setAviso('');
    try {
      await fn();
      setAviso(texto);
      setRefresco((n) => n + 1);
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo completar la acción.'));
    }
  };

  const botonesCita = (c) => {
    const b = (estado, texto, clase = 'btn-ghost') => (
      <button key={estado} className={`btn ${clase} btn-sm`}
              onClick={() => accion(() => cambiarEstadoCita(c.id, estado), `Cita marcada como ${estado}.`)}>
        {texto}
      </button>
    );
    if (c.estado === 'pendiente') return [b('confirmada', 'Confirmar', 'btn-primary'), b('cancelada', 'Cancelar', 'btn-danger')];
    if (c.estado === 'confirmada') return [b('atendida', 'Atendida', 'btn-primary'), b('cancelada', 'Cancelar', 'btn-danger')];
    return null;
  };

  const botonesSolicitud = (s) => s.estado === 'pendiente' && [
    <button key="a" className="btn btn-primary btn-sm"
            onClick={() => accion(() => responderSolicitud(s.id, 'aceptar'), `${s.empleado} ahora trabaja en ${s.veterinaria}.`)}>
      Aceptar
    </button>,
    <button key="r" className="btn btn-danger btn-sm"
            onClick={() => accion(() => responderSolicitud(s.id, 'rechazar'), 'Solicitud rechazada.')}>
      Rechazar
    </button>,
  ];

  const agregar = async (e) => {
    e.preventDefault();
    setErrorNueva('');
    try {
      const v = await crearVeterinaria(nueva);
      setVets((prev) => [v, ...prev]);
      setNueva(NUEVA);
    } catch (err) {
      setErrorNueva(mensajeDeError(err, 'No se pudo guardar la veterinaria.'));
    }
  };

  if (user.rol !== 'veterinario') {
    return <p className="alert" role="alert">Esta sección es solo para veterinarios.</p>;
  }

  return (
    <>
      <div className="page-head"><h1>Mi veterinaria</h1></div>

      <div className="chips" role="group" aria-label="Veterinaria">
        <button type="button" className={`chip ${sel === '' ? 'on' : ''}`} onClick={() => setSel('')}>Todas</button>
        {vets.map((v) => (
          <button key={v.id} type="button" className={`chip ${sel === String(v.id) ? 'on' : ''}`} onClick={() => setSel(String(v.id))}>
            {v.nombre}
          </button>
        ))}
      </div>

      <div className="tabs" role="tablist">
        {TABS.map(([id, texto]) => (
          <button key={id} role="tab" aria-selected={tab === id} className={`tab ${tab === id ? 'on' : ''}`}
                  onClick={() => { setTab(id); setQ(''); setAviso(''); }}>
            {texto}
          </button>
        ))}
      </div>

      <div className="field buscar">
        <label htmlFor="buscar">Buscar</label>
        <input id="buscar" type="search" value={q} onChange={(e) => setQ(e.target.value)}
               placeholder="Escribe para filtrar la tabla" />
      </div>

      {error && <p className="alert" role="alert">{error}</p>}
      {aviso && <p className="alert ok" role="status">{aviso}</p>}
      {cargando && <p className="muted">Cargando…</p>}

      {!cargando && tab === 'veterinarias' && (
        <>
          {visibles.length === 0 ? (
            <p className="empty">No hay veterinarias para mostrar.</p>
          ) : (
            <div className="vet-cards">
              {visibles.map((v) => (
                <article className="card" key={v.id}>
                  <h2>{v.nombre}</h2>
                  <p className="muted">{[v.direccion, v.barrio].filter(Boolean).join(', ')}</p>
                  <dl className="data">
                    <dt>Teléfono</dt><dd>{valor(v.telefono)}</dd>
                    <dt>Horario</dt><dd>{valor(v.horario)}</dd>
                  </dl>
                </article>
              ))}
            </div>
          )}

          <form className="card narrow form" onSubmit={agregar}>
            <h2>Agregar otra veterinaria</h2>
            {errorNueva && <p className="alert" role="alert">{errorNueva}</p>}
            {[['nombre', 'Nombre', true], ['direccion', 'Dirección', true], ['barrio', 'Barrio'], ['telefono', 'Teléfono'], ['horario', 'Horario']].map(([id, texto, req]) => (
              <div className="field" key={id}>
                <label htmlFor={`n-${id}`}>{texto}</label>
                <input id={`n-${id}`} value={nueva[id]} required={!!req}
                       onChange={(e) => setNueva({ ...nueva, [id]: e.target.value })} />
              </div>
            ))}
            <div className="form-actions">
              <button className="btn btn-primary" type="submit">Guardar veterinaria</button>
            </div>
          </form>
        </>
      )}

      {!cargando && tab !== 'veterinarias' && !error && (
        <Tabla
          filas={visibles}
          vacio={q ? 'Ningún registro coincide con la búsqueda.' : VACIAS[tab]}
          acciones={tab === 'citas' ? botonesCita : tab === 'solicitudes' ? botonesSolicitud : undefined}
          ocultar={tab === 'citas' ? ['id', 'correo', 'observaciones'] : []}
        />
      )}
    </>
  );
}
