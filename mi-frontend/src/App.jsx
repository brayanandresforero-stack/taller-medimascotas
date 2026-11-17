import { Routes, Route, NavLink, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Home from './pages/Home';
import Panel from './pages/Panel';

export default function App() {
  const { user, logout } = useAuth();
  return (
    <>
      {user && (
        <header className="app-header">
          <Link to="/" className="brand">Taller Masc</Link>
          <nav className="nav">
            <NavLink to="/" end>Inicio</NavLink>
            {user.rol === 'veterinario' && <NavLink to="/panel">Mi veterinaria</NavLink>}
            <NavLink to="/perfil">Mi perfil</NavLink>
          </nav>
          <div className="header-end">
            <span className="who">{user.nombre}</span>
            <button className="btn btn-ghost btn-sm" onClick={logout}>Salir</button>
          </div>
        </header>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/perfil" element={<main className="page"><Profile /></main>} />
          <Route path="/panel" element={<main className="page wide"><Panel /></main>} />
          <Route path="/perfil/editar" element={<main className="page"><EditProfile /></main>} />
        </Route>
        <Route path="*" element={<main className="page"><p>Página no encontrada</p></main>} />
      </Routes>
    </>
  );
}
