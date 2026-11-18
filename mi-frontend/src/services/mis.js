import api from '../api/axios';

const datos = (r) => r.data.data ?? r.data; // el backend responde { ok, data }

// Usuario (dueño de mascotas)
export const misMascotas    = ()      => api.get('/mis/mascotas').then(datos);
export const crearMascota   = (d)     => api.post('/mis/mascotas', d).then(datos);
export const misCitas       = ()      => api.get('/mis/citas').then(datos);
export const agendarCita    = (d)     => api.post('/mis/citas', d).then(datos);
export const cancelarCita   = (id)    => api.put(`/mis/citas/${id}/cancelar`).then(datos);
export const misConsultas   = ()      => api.get('/mis/consultas').then(datos);
export const listarEspecies = ()      => api.get('/especies').then(datos);
