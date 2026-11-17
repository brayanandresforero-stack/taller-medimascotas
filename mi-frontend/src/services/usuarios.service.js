import api from '../api/axiosConfig';

// GET /api/usuarios
export const getusuarios = async () => {
  const res = await api.get('/usuarios');
  return res.data;
};

// PUT /api/usuarios/:id   // NUEVO
export const updateusuario = async (id, data) => {
  const res = await api.put(`/usuarios/${id}`, data);
  return res.data;
};

import api from '../api/axios';

export const listar     = ()         => api.get('/usuarios').then(r => r.data);
export const obtener    = (id)       => api.get(`/usuarios/${id}`).then(r => r.data);
export const crear      = (datos)    => api.post('/usuarios', datos).then(r => r.data);
export const actualizar = (id, datos) => api.put(`/usuarios/${id}`, datos).then(r => r.data);
export const eliminar   = (id)       => api.delete(`/usuarios/${id}`);