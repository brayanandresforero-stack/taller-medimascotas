import { useState } from 'react';
import { createempleados } from '../services/empleados.service';

export default function empleadosForm({ onCreated }) {
  const [form, setForm] = useState({
    nombre: '', precio: ''
  });

  const handleChange = e => setForm({
    ...form, [e.target.name]: e.target.value
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createempleados(form);
    onCreated(); // recarga la lista en el padre
    setForm({ nombre: '', precio: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nombre" value={form.nombre}
        onChange={handleChange} placeholder="Nombre" />
      <input name="apellido" value={form.precio}
        onChange={handleChange} placeholder="Apellido" />
      <button type="submit">Crear</button>
    </form>
  );
}