import api from '../api/axiosConfig';

export const updateProducto = async (id, data) => {
  const res = await api.put(`/empleados/${id}`, data);
  return res.data;
};

// GET /api/productos
export const getProductos = async () => {
  const res = await api.get('/empleados');
  return res.data;
};