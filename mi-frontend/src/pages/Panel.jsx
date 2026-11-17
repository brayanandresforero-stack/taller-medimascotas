import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { misVeterinarias, crearVeterinaria, listarPanel } from '../services/panel';
import { mensajeDeError } from '../services/auth';

const TABS = [
  ['veterinarias', 'Mis veterinarias'],
  ['citas', 'Citas'],
  ['consultas', 'Consultas'],
  ['inventario', 'Inventario'],
  ['empleados', 'Empleados'],
];
const VACIAS = {
  citas: 'Aún no hay citas en esta veterinaria.',
  consultas: 'Aún no hay consultas en esta veterinaria.',
  inventario: 'Aún no hay productos en el inventario de esta veterinaria.',
  empleados: 'Todavía no se ha registrado ningún empleado en esta veterinaria.',
};
const NUEVA = { nombre: '', direccion: '', barrio: '', telefono: '', horario: '' };

const etiqueta = (k) => k.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
const valor = (v) => {
  if (v === null || v === undefined || v === '') return '—';
  if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v)) return new Date(v).toLocaleString('es-CO');
  return String(v);
};

function Tabla({ filas, vacio }) {
  if (!filas.length) return <p className="empty">{vacio}</p>;
  const cols = Object.keys(filas[0]).filter((k) => k !== 'password');
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{cols.map((c) => <th key={c}>{etiqueta(c)}</th>)}</tr></thead>
        <tbody>
          {filas.map((f, i) => (
            <tr key={f.id ?? i}>{cols.map((c) => <td key={c}>{valor(f[c])}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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
  }, [tab, sel]);

  const visibles = useMemo(() => {
    const base = tab === 'veterinarias' ? vets.filter((v) => !sel || String(v.id) === sel) : filas;
    const t = q.trim().toLowerCase();
    if (!t) return base;
    return base.filter((f) => Object.values(f).some((v) => String(v ?? '').toLowerCase().includes(t)));
  }, [tab, vets, filas, sel, q]);

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
                  onClick={() => { setTab(id); setQ(''); }}>
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
        <Tabla filas={visibles} vacio={q ? 'Ningún registro coincide con la búsqueda.' : VACIAS[tab]} />
      )}
    </>
  );
}
