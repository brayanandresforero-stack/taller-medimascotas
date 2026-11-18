// Tabla genérica: una columna por campo, la columna "estado" como etiqueta de color
// y, si se pasa `acciones`, una última columna con botones por fila.

const ETIQUETAS = { fecha_hora: 'Fecha y hora', propietario: 'Propietario', correo: 'Correo' };

export const etiqueta = (k) => ETIQUETAS[k] || k.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());

export const valor = (v) => {
  if (v === null || v === undefined || v === '') return '—';
  if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v)) return new Date(v).toLocaleString('es-CO');
  return String(v);
};

export function Estado({ valor: v }) {
  const texto = v || 'sin estado';
  return <span className={`estado estado-${texto.replace(/\s/g, '-')}`}>{texto}</span>;
}

export default function Tabla({ filas, vacio, acciones, ocultar = [] }) {
  if (!filas.length) return <p className="empty">{vacio}</p>;
  const cols = Object.keys(filas[0]).filter((k) => k !== 'password' && !ocultar.includes(k));
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {cols.map((c) => <th key={c}>{etiqueta(c)}</th>)}
            {acciones && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {filas.map((f, i) => (
            <tr key={f.id ?? i}>
              {cols.map((c) => (
                <td key={c}>{c === 'estado' ? <Estado valor={f[c]} /> : valor(f[c])}</td>
              ))}
              {acciones && <td><div className="row-actions">{acciones(f)}</div></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
