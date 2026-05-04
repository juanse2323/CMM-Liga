import { useState, useEffect, useCallback } from 'react';
import type { Club, Partido, EstadisticaClub, Noticia, AuthState, Jugador } from '@/types';

const CLUBES_KEY = 'ccm_clubes';
const PARTIDOS_KEY = 'ccm_partidos';
const NOTICIAS_KEY = 'ccm_noticias';
const AUTH_KEY = 'ccm_auth';
const ESTADISTICAS_KEY = 'ccm_estadisticas_manual';
const ADMINS_KEY = 'ccm_admins';

const adminsIniciales = [
  { username: 'Juansec', password: 'Sebitastqm09', role: 'supreme' as const },
  { username: 'Max', password: 'Max12344', role: 'admin' as const },
];

export const convertirImagenABase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const clubesIniciales: Club[] = [
  { id: '1', nombre: 'Atlético Nacional', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Atletico_Nacional.png/200px-Atletico_Nacional.png' },
  { id: '2', nombre: 'Millonarios FC', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Millonarios_FC.png/200px-Millonarios_FC.png' },
  { id: '3', nombre: 'América de Cali', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Am%C3%A9rica_de_Cali.png/200px-Am%C3%A9rica_de_Cali.png' },
  { id: '4', nombre: 'Deportivo Cali', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Deportivo_Cali.png/200px-Deportivo_Cali.png' },
  { id: '5', nombre: 'Independiente Santa Fe', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Santa_Fe.png/200px-Santa_Fe.png' },
  { id: '6', nombre: 'Deportivo Pasto', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Deportivo_Pasto.png/200px-Deportivo_Pasto.png' },
  { id: '7', nombre: 'Junior de Barranquilla', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Junior_de_Barranquilla.png/200px-Junior_de_Barranquilla.png' },
  { id: '8', nombre: 'Once Caldas', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Once_Caldas.png/200px-Once_Caldas.png' },
];

const partidosIniciales: Partido[] = [
  { id: '1', localId: '1', visitanteId: '2', fecha: '2026-05-10', hora: '18:00', golesLocal: null, golesVisitante: null, jugado: false, jornada: 1 },
  { id: '2', localId: '3', visitanteId: '4', fecha: '2026-05-10', hora: '20:00', golesLocal: null, golesVisitante: null, jugado: false, jornada: 1 },
  { id: '3', localId: '5', visitanteId: '6', fecha: '2026-05-11', hora: '16:00', golesLocal: null, golesVisitante: null, jugado: false, jornada: 1 },
  { id: '4', localId: '7', visitanteId: '8', fecha: '2026-05-11', hora: '18:30', golesLocal: null, golesVisitante: null, jugado: false, jornada: 1 },
  { id: '5', localId: '2', visitanteId: '3', fecha: '2026-05-17', hora: '18:00', golesLocal: null, golesVisitante: null, jugado: false, jornada: 2 },
  { id: '6', localId: '4', visitanteId: '1', fecha: '2026-05-17', hora: '20:00', golesLocal: null, golesVisitante: null, jugado: false, jornada: 2 },
  { id: '7', localId: '6', visitanteId: '7', fecha: '2026-05-18', hora: '16:00', golesLocal: null, golesVisitante: null, jugado: false, jornada: 2 },
  { id: '8', localId: '8', visitanteId: '5', fecha: '2026-05-18', hora: '18:30', golesLocal: null, golesVisitante: null, jugado: false, jornada: 2 },
];

const noticiasIniciales: Noticia[] = [
  {
    id: '1',
    titulo: 'Liga CCM anuncia el inicio de la temporada 2026',
    subtitulo: 'La competencia más emocionante del fútbol Roblox comienza este mes con 8 equipos disputando el título.',
    contenido: 'La Liga CCM se complace en anunciar el inicio oficial de la temporada 2026. Con 8 equipos de élite compitiendo por la gloria, esta promete ser la temporada más emocionante hasta la fecha.',
    imagenUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop',
    fecha: '2026-05-01',
    categoria: 'Torneo',
    destacada: true,
  },
  {
    id: '2',
    titulo: 'Nacional refuerza su plantilla para la temporada',
    subtitulo: 'El equipo verdolaga presentó tres nuevos fichajes de cara a la competencia.',
    contenido: 'Atlético Nacional presentó oficialmente a sus nuevos refuerzos para la temporada 2026 de la Liga CCM. Los jugadores llegan con grandes expectativas.',
    imagenUrl: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=600&h=400&fit=crop',
    fecha: '2026-04-28',
    categoria: 'Transferencia',
    destacada: true,
  },
  {
    id: '3',
    titulo: 'Millonarios busca recuperar la corona',
    subtitulo: 'El equipo embajador trabaja intensamente en la pretemporada.',
    contenido: 'Millonarios FC tiene claro su objetivo: recuperar el título de la Liga CCM. El cuerpo técnico ha diseñado una pretemporada exigente.',
    imagenUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&h=400&fit=crop',
    fecha: '2026-04-25',
    categoria: 'Declaración',
    destacada: false,
  },
  {
    id: '4',
    titulo: 'América de Cali presenta su nuevo uniforme',
    subtitulo: 'El escarlata estrenará indumentaria para la temporada 2026.',
    contenido: 'América de Cali lanzó su nuevo uniforme para la temporada 2026 de la Liga CCM, manteniendo los colores tradicionales con un diseño moderno.',
    imagenUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&h=400&fit=crop',
    fecha: '2026-04-22',
    categoria: 'General',
    destacada: false,
  },
  {
    id: '5',
    titulo: 'Fixture de la primera jornada confirmado',
    subtitulo: 'Se definieron las fechas y horarios de los primeros partidos.',
    contenido: 'La Liga CCM confirmó el fixture completo de la primera jornada. Los enfrentamientos prometen emociones desde el primer minuto.',
    imagenUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&h=400&fit=crop',
    fecha: '2026-04-20',
    categoria: 'Partido',
    destacada: false,
  },
  {
    id: '6',
    titulo: 'Deportivo Pasto apuesta por juveniles',
    subtitulo: 'El equipo volcánico promoverá talentos de su cantera.',
    contenido: 'Deportivo Pasto anunció que dará oportunidades a jóvenes talentos de su cantera durante la temporada 2026 de la Liga CCM.',
    imagenUrl: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&h=400&fit=crop',
    fecha: '2026-04-18',
    categoria: 'Declaración',
    destacada: false,
  },
];

function cargarDatos<T>(key: string, iniciales: T): T {
  try {
    const datos = localStorage.getItem(key);
    return datos ? JSON.parse(datos) : iniciales;
  } catch {
    return iniciales;
  }
}

export function useLigaCCM() {
  const [clubes, setClubes] = useState<Club[]>(() => cargarDatos(CLUBES_KEY, clubesIniciales));
  const [partidos, setPartidos] = useState<Partido[]>(() => cargarDatos(PARTIDOS_KEY, partidosIniciales));
  const [noticias, setNoticias] = useState<Noticia[]>(() => cargarDatos(NOTICIAS_KEY, noticiasIniciales));
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem(AUTH_KEY);
    return saved ? JSON.parse(saved) : { isAuthenticated: false, username: '' };
  });

  const [estadisticasManuales, setEstadisticasManuales] = useState<Record<string, Partial<EstadisticaClub>>>(() => {
    return cargarDatos(ESTADISTICAS_KEY, {});
  });

  const [admins, setAdmins] = useState<{ username: string; password: string; role: 'supreme' | 'admin' }[]>(() => {
    return cargarDatos(ADMINS_KEY, adminsIniciales);
  });

  useEffect(() => localStorage.setItem(CLUBES_KEY, JSON.stringify(clubes)), [clubes]);
  useEffect(() => localStorage.setItem(PARTIDOS_KEY, JSON.stringify(partidos)), [partidos]);
  useEffect(() => localStorage.setItem(NOTICIAS_KEY, JSON.stringify(noticias)), [noticias]);
  useEffect(() => localStorage.setItem(AUTH_KEY, JSON.stringify(auth)), [auth]);
  useEffect(() => localStorage.setItem(ESTADISTICAS_KEY, JSON.stringify(estadisticasManuales)), [estadisticasManuales]);
  useEffect(() => localStorage.setItem(ADMINS_KEY, JSON.stringify(admins)), [admins]);

  const calcularEstadisticas = useCallback((): EstadisticaClub[] => {
    const statsMap = new Map<string, EstadisticaClub>();
    
    clubes.forEach(club => {
      statsMap.set(club.id, {
        clubId: club.id,
        pj: 0, pg: 0, pe: 0, pp: 0,
        gf: 0, gc: 0, dg: 0, pts: 0,
      });
    });

    partidos.filter(p => p.jugado && p.golesLocal !== null && p.golesVisitante !== null).forEach(p => {
      const local = statsMap.get(p.localId);
      const visitante = statsMap.get(p.visitanteId);
      if (!local || !visitante) return;

      local.pj++; visitante.pj++;
      local.gf += p.golesLocal!; local.gc += p.golesVisitante!;
      visitante.gf += p.golesVisitante!; visitante.gc += p.golesLocal!;

      if (p.golesLocal! > p.golesVisitante!) {
        local.pg++; local.pts += 3;
        visitante.pp++;
      } else if (p.golesLocal! < p.golesVisitante!) {
        visitante.pg++; visitante.pts += 3;
        local.pp++;
      } else {
        local.pe++; local.pts += 1;
        visitante.pe++; visitante.pts += 1;
      }

      local.dg = local.gf - local.gc;
      visitante.dg = visitante.gf - visitante.gc;
    });

    const result = Array.from(statsMap.values()).map(stat => {
      const manual = estadisticasManuales[stat.clubId];
      if (manual) {
        return {
          ...stat,
          pj: manual.pj ?? stat.pj,
          pg: manual.pg ?? stat.pg,
          pe: manual.pe ?? stat.pe,
          pp: manual.pp ?? stat.pp,
          gf: manual.gf ?? stat.gf,
          gc: manual.gc ?? stat.gc,
          dg: manual.dg ?? stat.dg,
          pts: manual.pts ?? stat.pts,
        };
      }
      return stat;
    });

    return result.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.dg !== a.dg) return b.dg - a.dg;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return 0;
    });
  }, [clubes, partidos, estadisticasManuales]);

  const estadisticas = calcularEstadisticas();

  // Auth
  const login = useCallback((username: string, password: string): boolean => {
    const admin = admins.find(a => a.username.toLowerCase() === username.toLowerCase() && a.password === password);
    if (admin) {
      setAuth({ isAuthenticated: true, username: admin.username, role: admin.role });
      return true;
    }
    return false;
  }, [admins]);

  const logout = useCallback(() => {
    setAuth({ isAuthenticated: false, username: '', role: 'admin' });
  }, []);

  // Admin management (solo supreme)
  const agregarAdmin = useCallback((username: string, password: string, role: 'supreme' | 'admin') => {
    if (auth.role !== 'supreme') return false;
    const existe = admins.find(a => a.username.toLowerCase() === username.toLowerCase());
    if (existe) return false;
    setAdmins(prev => [...prev, { username, password, role }]);
    return true;
  }, [admins, auth.role]);

  const eliminarAdmin = useCallback((username: string) => {
    if (auth.role !== 'supreme') return false;
    if (username === 'Juansec') return false;
    setAdmins(prev => prev.filter(a => a.username !== username));
    return true;
  }, [auth.role]);

  const getAdmins = useCallback(() => {
    return admins.map(a => ({ username: a.username, role: a.role }));
  }, [admins]);

  // Clubes CRUD
  const agregarClub = useCallback((nombre: string, logoUrl: string) => {
    const nuevo: Club = {
      id: Date.now().toString(),
      nombre,
      logoUrl: logoUrl || 'https://via.placeholder.com/64?text=CCM',
    };
    setClubes(prev => [...prev, nuevo]);
  }, []);

  const editarClub = useCallback((id: string, nombre: string, logoUrl: string) => {
    setClubes(prev => prev.map(c => c.id === id ? { ...c, nombre, logoUrl } : c));
  }, []);

  const eliminarClub = useCallback((id: string) => {
    setClubes(prev => prev.filter(c => c.id !== id));
    setPartidos(prev => prev.filter(p => p.localId !== id && p.visitanteId !== id));
  }, []);

  // Jugadores CRUD
  const agregarJugador = useCallback((clubId: string, nombre: string, posicion: string, numero: string) => {
    const nuevoJugador: Jugador = {
      id: Date.now().toString(),
      nombre,
      posicion,
      numero,
    };
    setClubes(prev => prev.map(c => {
      if (c.id === clubId) {
        return { ...c, jugadores: [...(c.jugadores || []), nuevoJugador] };
      }
      return c;
    }));
  }, []);

  const eliminarJugador = useCallback((clubId: string, jugadorId: string) => {
    setClubes(prev => prev.map(c => {
      if (c.id === clubId) {
        return { ...c, jugadores: (c.jugadores || []).filter(j => j.id !== jugadorId) };
      }
      return c;
    }));
  }, []);

  const editarJugador = useCallback((clubId: string, jugadorId: string, nombre: string, posicion: string, numero: string) => {
    setClubes(prev => prev.map(c => {
      if (c.id === clubId) {
        return {
          ...c,
          jugadores: (c.jugadores || []).map(j => j.id === jugadorId ? { ...j, nombre, posicion, numero } : j),
        };
      }
      return c;
    }));
  }, []);

  // Partidos CRUD
  const programarPartido = useCallback((localId: string, visitanteId: string, fecha: string, hora: string, jornada: number) => {
    const nuevo: Partido = {
      id: Date.now().toString(),
      localId, visitanteId, fecha, hora,
      golesLocal: null, golesVisitante: null,
      jugado: false, jornada,
    };
    setPartidos(prev => [...prev, nuevo]);
  }, []);

  const registrarResultado = useCallback((partidoId: string, golesLocal: number, golesVisitante: number) => {
    setPartidos(prev => prev.map(p =>
      p.id === partidoId
        ? { ...p, golesLocal, golesVisitante, jugado: true }
        : p
    ));
  }, []);

  const eliminarPartido = useCallback((id: string) => {
    setPartidos(prev => prev.filter(p => p.id !== id));
  }, []);

  const resetPartido = useCallback((id: string) => {
    setPartidos(prev => prev.map(p =>
      p.id === id ? { ...p, golesLocal: null, golesVisitante: null, jugado: false } : p
    ));
  }, []);

  // Noticias CRUD
  const agregarNoticia = useCallback((noticia: Omit<Noticia, 'id'>) => {
    const nueva: Noticia = { ...noticia, id: Date.now().toString() };
    setNoticias(prev => [nueva, ...prev]);
  }, []);

  const editarNoticia = useCallback((id: string, datos: Partial<Noticia>) => {
    setNoticias(prev => prev.map(n => n.id === id ? { ...n, ...datos } : n));
  }, []);

  const eliminarNoticia = useCallback((id: string) => {
    setNoticias(prev => prev.filter(n => n.id !== id));
  }, []);

  const getClubById = useCallback((id: string) => clubes.find(c => c.id === id), [clubes]);

  const editarEstadisticas = useCallback((clubId: string, datos: Partial<EstadisticaClub>) => {
    setEstadisticasManuales(prev => ({
      ...prev,
      [clubId]: datos,
    }));
  }, []);

  return {
    // Estado
    clubes, partidos, noticias, auth, estadisticas,
    // Auth
    login, logout,
    // Clubes
    agregarClub, editarClub, eliminarClub,
    // Jugadores
    agregarJugador, eliminarJugador, editarJugador,
    // Partidos
    programarPartido, registrarResultado, eliminarPartido, resetPartido,
    // Noticias
    agregarNoticia, editarNoticia, eliminarNoticia,
    // Utilidades
    getClubById,
    // Estadísticas
    editarEstadisticas,
    // Admins
    agregarAdmin, eliminarAdmin, getAdmins,
  };
}
