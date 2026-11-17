import { useState, useEffect } from 'react';
import { getProductos } from '../services/empleados.service';

export default function EmpleadosPage() {
  const [empleados, setempleados] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getEmpleados()
      .then(data => setempleados(data))
      .finally(() => setLoading(false));
  }, []); // [] = solo al montar el componente

  if (loading) return <p>Cargando...</p>;

  return (
    <ul>
      {empleados.map(e => (
        <li key={e.id}>{e.nombre}</li>
      ))}
    </ul>
  );
}