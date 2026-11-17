import { useState } from 'react';
import { createusuarios } from '../services/usuarios.service';

export default function UsuarioForm({ onCreated }) {
  const [form, setForm] = useState({
    nombre: '', email: '', edad: ''
  });

  const handleChange = e => setForm({
    ...form, [e.target.name]: e.target.value
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createusuarios(form);
    onCreated(); // recarga la lista en el padre
    setForm({ nombre: '', email: '', edad: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nombre" value={form.nombre}
        onChange={handleChange} placeholder="Nombre" />
      <input name="email" value={form.email}
        onChange={handleChange} placeholder="Email" />
      <input name="edad" value={form.edad}
        onChange={handleChange} placeholder="Edad" />
      <button type="submit">Crear</button>
    </form>
  );
}