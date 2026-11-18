import api from '../api/axios';

const datos = (r) => r.data.data ?? r.data; // el backend responde { ok, data }

export const misVeterinarias = () => api.get('/panel/veterinarias').then(datos);
export const crearVeterinaria = (d) => api.post('/panel/veterinarias', d).then(datos);
// recurso: citas | consultas | inventario | empleados | solicitudes
export const listarPanel = (recurso, veterinariaId) =>
  api.get(`/panel/${recurso}`, { params: veterinariaId ? { veterinaria_id: veterinariaId } : {} }).then(datos);
// accion: 'aceptar' | 'rechazar'
export const responderSolicitud = (id, accion) => api.put(`/panel/solicitudes/${id}`, { accion }).then(datos);
// estado: 'confirmada' | 'atendida' | 'cancelada'
export const cambiarEstadoCita = (id, estado) => api.put(`/panel/citas/${id}`, { estado }).then(datos);
