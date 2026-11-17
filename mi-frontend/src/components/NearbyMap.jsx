import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Servidores públicos de Overpass (datos de OpenStreetMap, sin clave)
const OVERPASS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];
const RADIOS = [5000, 15000]; // si no hay nada cerca, amplía una vez
const MOVIMIENTO_MINIMO = 300; // metros antes de volver a buscar

const metros = (a, b) => {
  const R = 6371000, rad = (x) => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
const distanciaTexto = (m) => (m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`);

async function buscarVeterinarias(pos, radio, signal) {
  const q = `[out:json][timeout:20];(node["amenity"="veterinary"](around:${radio},${pos.lat},${pos.lng});way["amenity"="veterinary"](around:${radio},${pos.lat},${pos.lng}););out center tags;`;
  let ultimo;
  for (const url of OVERPASS) {
    try {
      const r = await fetch(url, { method: 'POST', body: new URLSearchParams({ data: q }), signal });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const { elements } = await r.json();
      return elements
        .map((el) => {
          const lat = el.lat ?? el.center?.lat, lng = el.lon ?? el.center?.lon, t = el.tags || {};
          if (lat == null || lng == null) return null;
          return {
            id: `${el.type}-${el.id}`,
            nombre: t.name || 'Veterinaria sin nombre',
            direccion: [t['addr:street'], t['addr:housenumber']].filter(Boolean).join(' '),
            telefono: t.phone || t['contact:phone'] || '',
            lat, lng,
            distancia: metros(pos, { lat, lng }),
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.distancia - b.distancia);
    } catch (e) {
      if (e.name === 'AbortError') throw e;
      ultimo = e;
    }
  }
  throw ultimo;
}

// El contenido del popup se arma con textContent: los nombres vienen de OpenStreetMap
const popupDe = (v) => {
  const d = document.createElement('div');
  const b = document.createElement('strong');
  b.textContent = v.nombre;
  d.append(b);
  [v.direccion, v.telefono, distanciaTexto(v.distancia)].filter(Boolean).forEach((t) => {
    const p = document.createElement('div');
    p.textContent = t;
    d.append(p);
  });
  return d;
};

export default function NearbyMap() {
  const [estado, setEstado] = useState('buscando'); // buscando | ok | denegado | error-gps | sin-soporte
  const [pos, setPos] = useState(null);
  const [vets, setVets] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [errorVets, setErrorVets] = useState('');
  const [radio, setRadio] = useState(RADIOS[0]);
  const [intento, setIntento] = useState(0);

  const contRef = useRef(null);
  const mapaRef = useRef(null);
  const capaRef = useRef(null);
  const yoRef = useRef(null);
  const marcadores = useRef({});
  const ultima = useRef(null);
  const ctlRef = useRef(null);
  const reqRef = useRef(0);

  // 1. Sigue la ubicación del dispositivo mientras la página esté abierta
  useEffect(() => {
    if (!('geolocation' in navigator)) { setEstado('sin-soporte'); return; }
    setEstado('buscando');
    const id = navigator.geolocation.watchPosition(
      (p) => {
        setPos({ lat: p.coords.latitude, lng: p.coords.longitude });
        setEstado('ok');
      },
      (e) => setEstado(e.code === 1 ? 'denegado' : 'error-gps'),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [intento]);

  // 2. Crea el mapa la primera vez y mueve tu marcador en cada actualización
  useEffect(() => {
    if (!pos || !contRef.current) return;
    if (!mapaRef.current) {
      const m = L.map(contRef.current).setView([pos.lat, pos.lng], 14);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(m);
      capaRef.current = L.layerGroup().addTo(m);
      yoRef.current = L.circleMarker([pos.lat, pos.lng], {
        radius: 9, color: '#ffffff', weight: 3, fillColor: '#1d6fe0', fillOpacity: 1,
      }).addTo(m).bindTooltip('Tú estás aquí');
      mapaRef.current = m;
    } else {
      yoRef.current.setLatLng([pos.lat, pos.lng]);
    }
  }, [pos]);

  useEffect(() => () => {
    ctlRef.current?.abort();
    mapaRef.current?.remove();
    mapaRef.current = null;
  }, []);

  // 3. Busca veterinarias al inicio y cada vez que te mueves más de 300 m
  useEffect(() => {
    if (!pos) return;
    const prev = ultima.current;
    if (prev && prev.radio === radio && metros(prev, pos) < MOVIMIENTO_MINIMO) return;
    ultima.current = { lat: pos.lat, lng: pos.lng, radio };

    ctlRef.current?.abort();
    const ctl = new AbortController();
    ctlRef.current = ctl;
    const id = ++reqRef.current;
    setCargando(true);
    setErrorVets('');

    buscarVeterinarias(pos, radio, ctl.signal)
      .then((lista) => {
        if (id !== reqRef.current) return;
        if (lista.length === 0 && radio === RADIOS[0]) { setRadio(RADIOS[1]); return; }
        setVets(lista);
      })
      .catch((e) => {
        if (e.name === 'AbortError' || id !== reqRef.current) return;
        ultima.current = null; // permite reintentar en la próxima actualización
        setErrorVets('No se pudieron cargar las veterinarias. Se reintentará al moverte o con el botón.');
      })
      .finally(() => { if (id === reqRef.current) setCargando(false); });
  }, [pos, radio, intento]);

  // 4. Dibuja las veterinarias en el mapa
  useEffect(() => {
    const capa = capaRef.current;
    if (!capa) return;
    capa.clearLayers();
    marcadores.current = {};
    vets.forEach((v) => {
      const m = L.circleMarker([v.lat, v.lng], {
        radius: 8, color: '#ffffff', weight: 2, fillColor: '#0f5c58', fillOpacity: 1,
      }).bindPopup(popupDe(v));
      m.addTo(capa);
      marcadores.current[v.id] = m;
    });
  }, [vets, pos]);

  const verEnMapa = (v) => {
    mapaRef.current?.setView([v.lat, v.lng], 16);
    marcadores.current[v.id]?.openPopup();
  };
  const centrar = () => pos && mapaRef.current?.setView([pos.lat, pos.lng], 15);
  const reintentar = () => { ultima.current = null; setIntento((n) => n + 1); };

  const mensajes = {
    buscando: 'Buscando tu ubicación. Acepta el permiso de ubicación del navegador.',
    denegado: 'La ubicación está bloqueada. Actívala desde el candado de la barra de direcciones y pulsa Reintentar.',
    'error-gps': 'No se pudo obtener tu ubicación. Revisa que el GPS o la ubicación del equipo estén activos.',
    'sin-soporte': 'Este navegador no permite obtener la ubicación.',
  };

  return (
    <section className="cerca" aria-labelledby="cerca-titulo">
      <div className="cerca-lista">
        <h2 id="cerca-titulo">Veterinarias cerca de ti</h2>

        {estado !== 'ok' && (
          <>
            <p className="muted">{mensajes[estado]}</p>
            {estado !== 'buscando' && estado !== 'sin-soporte' && (
              <button className="btn btn-primary btn-sm" onClick={reintentar}>Reintentar</button>
            )}
          </>
        )}

        {estado === 'ok' && (
          <>
            <p className="muted">
              {cargando ? 'Buscando veterinarias…' : `A menos de ${radio / 1000} km. Se actualiza mientras te mueves.`}
            </p>
            {errorVets && <p className="alert" role="alert">{errorVets}</p>}
            {!cargando && !errorVets && vets.length === 0 && (
              <p className="muted">No encontramos veterinarias a menos de {radio / 1000} km.</p>
            )}
            <ul className="vet-lista">
              {vets.slice(0, 12).map((v) => (
                <li key={v.id}>
                  <button type="button" onClick={() => verEnMapa(v)}>
                    <span className="vet-nombre">{v.nombre}</span>
                    <span className="vet-dato">{[v.direccion, v.telefono].filter(Boolean).join(' · ') || 'Sin más datos'}</span>
                    <span className="vet-dist">{distanciaTexto(v.distancia)}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="form-actions">
              <button className="btn btn-ghost btn-sm" onClick={centrar}>Centrar en mi ubicación</button>
              {errorVets && <button className="btn btn-primary btn-sm" onClick={reintentar}>Reintentar</button>}
            </div>
          </>
        )}
      </div>

      <div className="cerca-mapa">
        <div ref={contRef} className="mapa" role="region" aria-label="Mapa de veterinarias cercanas" />
        {estado !== 'ok' && <div className="mapa-aviso">{mensajes[estado]}</div>}
      </div>
    </section>
  );
}
