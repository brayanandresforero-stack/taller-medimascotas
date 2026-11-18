import api from '../api/axios';

const datos = (r) => r.data.data ?? r.data; // el backend responde { ok, data }

// Empleado: su veterinaria, sus solicitudes y las citas de su veterinaria
export const miTrabajo          = ()   => api.get('/trabajo').then(datos);
export const solicitarIngreso   = (d)  => api.post('/trabajo/solicitudes', d).then(datos);
export const retirarSolicitud   = (id) => api.delete(`/trabajo/solicitudes/${id}`).then(datos);
export const citasDeMiTrabajo   = ()   => api.get('/trabajo/citas').then(datos);
