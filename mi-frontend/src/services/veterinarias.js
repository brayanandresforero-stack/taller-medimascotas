import api from '../api/axios';

const datos = (r) => r.data.data ?? r.data;

export const listarVeterinarias = () => api.get('/veterinarias').then(datos);
export const obtenerVeterinaria = (id) => api.get(`/veterinarias/${id}`).then(datos);
