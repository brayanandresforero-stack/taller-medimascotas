import api from '../api/axios';

const datos = (r) => r.data.data ?? r.data; // el backend responde { ok, data }

export const misVeterinarias = () => api.get('/panel/veterinarias').then(datos);
export const crearVeterinaria = (d) => api.post('/panel/veterinarias', d).then(datos);
// recurso: citas | consultas | inventario | empleados
export const listarPanel = (recurso, veterinariaId) =>
  api.get(`/panel/${recurso}`, { params: veterinariaId ? { veterinaria_id: veterinariaId } : {} }).then(datos);
