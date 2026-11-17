const OPCIONES = [['usuario', 'Usuario'], ['empleado', 'Empleado'], ['veterinario', 'Veterinario']];

export default function TipoCuenta({ value, onChange }) {
  return (
    <div className="segmented" role="radiogroup" aria-label="Tipo de cuenta">
      {OPCIONES.map(([v, texto]) => (
        <label key={v}>
          <input type="radio" name="tipo" value={v} checked={value === v} onChange={onChange} />
          {texto}
        </label>
      ))}
    </div>
  );
}
