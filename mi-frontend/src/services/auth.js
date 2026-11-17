import api from '../api/axios';

// Devuelve el mensaje del backend o, si no hay, explica qué pasó realmente
export const mensajeDeError = (err, porDefecto) => {
  const r = err.response;
  if (!r) {
    const base = err.config?.baseURL || 'la API';
    return `No hay conexión con ${base}. Revisa que el backend esté encendido y que la dirección sea correcta (${err.message}).`;
  }
  const d = r.data;
  const delServidor = typeof d === 'string' ? '' : d?.error || d?.message || d?.msg;
  if (delServidor) return delServidor;
  const donde = `${(err.config?.method || '').toUpperCase()} ${err.config?.baseURL || ''}${err.config?.url || ''}`;
  return `${porDefecto} (el servidor respondió ${r.status} en ${donde}).`;
};

// El token JWT lleva el id y el rol (usuario, empleado o veterinario)
const datosToken = () => {
  try {
    const b64 = localStorage.getItem('token').split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(b64));
  } catch {
    return {};
  }
};
const idDelToken = () => datosToken().id ?? null;

// Cada tipo de cuenta vive en su propia ruta del backend
const RECURSO = { usuario: 'usuarios', empleado: 'empleados' };
const tipoActual = () => (localStorage.getItem('tipo') === 'empleado' ? 'empleado' : 'usuario');
const claveFoto = (tipo, id) => `foto:${tipo}:${id}`;

export const registrar = (datos) => api.post('/auth/register', datos).then((r) => r.data); // { token }
export const iniciarSesion = (email, password, tipo = 'usuario') =>
  api.post('/auth/login', { email, password, tipo }).then((r) => r.data); // { token }

export const obtenerPerfil = async () => {
  const id = idDelToken();
  const tipo = tipoActual();
  const { data } = (await api.get(`/${RECURSO[tipo]}/${id}`)).data; // el backend responde { ok, data }
  const { password, ...perfil } = data; // nunca guardar el hash en el estado
  let fotoUrl = null;
  try { fotoUrl = localStorage.getItem(claveFoto(tipo, id)); } catch { /* sin foto */ }
  return { ...perfil, tipo, rol: datosToken().rol || tipo, fotoUrl };
};

export const actualizarPerfil = async (datos) => {
  await api.put(`/${RECURSO[tipoActual()]}/${idDelToken()}`, datos);
  return obtenerPerfil();
};

// Reduce la imagen a 256 px para que ocupe poco espacio
const aDataUrl = (archivo, lado = 256) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(archivo);
    img.onload = () => {
      const escala = Math.min(1, lado / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * escala);
      c.height = Math.round(img.height * escala);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('No se pudo leer la imagen')); };
    img.src = url;
  });

// La foto se guarda en este navegador (el backend no tiene dónde guardarla)
export const guardarFoto = async (archivo) => {
  localStorage.setItem(claveFoto(tipoActual(), idDelToken()), await aDataUrl(archivo));
  return obtenerPerfil();
};
