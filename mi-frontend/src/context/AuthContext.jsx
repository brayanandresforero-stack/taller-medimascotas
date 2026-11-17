import { createContext, useContext, useEffect, useState } from 'react';
import { iniciarSesion, obtenerPerfil } from '../services/auth';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tipo');
    setUser(null);
  };

  // Al abrir la app: si hay token guardado, recupera el perfil
  useEffect(() => {
    if (!localStorage.getItem('token')) { setLoading(false); return; }
    obtenerPerfil().then(setUser).catch(logout).finally(() => setLoading(false));
  }, []);

  const login = async (email, password, tipo = 'usuario') => {
    const { token } = await iniciarSesion(email, password, tipo);
    localStorage.setItem('token', token);
    localStorage.setItem('tipo', tipo);
    const perfil = await obtenerPerfil();
    setUser(perfil);
    return perfil; // el login usa el rol para decidir adónde ir
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
