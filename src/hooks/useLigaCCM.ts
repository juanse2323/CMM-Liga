import { useState, useEffect, useCallback } from 'react';
import type { Club, Partido, EstadisticaClub, Noticia, AuthState, Jugador, Admin } from '@/types';
import datosIniciales from '@/data.json';
import { saveToGitHub } from '@/lib/local-db';
import { fetchDataWithNoCache } from '@/lib/data-sync';

const CLUBES_KEY = 'ccm_clubes';
const PARTIDOS_KEY = 'ccm_partidos';
const NOTICIAS_KEY = 'ccm_noticias';
const AUTH_KEY = 'ccm_auth';
const ESTADISTICAS_KEY = 'ccm_estadisticas_manual';
const ADMINS_KEY = 'ccm_admins';

// Admin inicial - Las contraseñas vienen de .env hasheadas
const loadAdminsIniciales = (): Admin[] => {
  // En desarrollo local, usar valores por defecto
  // En producción, estos deben venir de .env hasheados
  if (import.meta.env.VITE_ADMIN_USERNAME_1) {
    return [
      {
        username: import.meta.env.VITE_ADMIN_USERNAME_1 || 'Juansec',
        passwordHash: import.meta.env.VITE_ADMIN_PASS_HASH_1 || '',
        role: 'supreme'
      },
      {
        username: import.meta.env.VITE_ADMIN_USERNAME_2 || 'Max',
        passwordHash: import.meta.env.VITE_ADMIN_PASS_HASH_2 || '',
        role: 'admin'
      }
    ];
  }

  // Fallback (para desarrollo sin .env)
  return [
    { username: 'Juansec', passwordHash: 'hash_placeholder', role: 'supreme' },
    { username: 'Max', passwordHash: 'hash_placeholder', role: 'admin' }
  ];
};

export const convertirImagenABase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const clubesIniciales: Club[] = datosIniciales.clubes as Club[];
const partidosIniciales: Partido[] = datosIniciales.partidos as Partido[];
const noticiasIniciales: Noticia[] = datosIniciales.noticias as Noticia[];

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
    return saved ? JSON.parse(saved) : { isAuthenticated: false, username: '', role: 'admin' };
  });

  const [estadisticasManuales, setEstadisticasManuales] = useState<Record<string, Partial<EstadisticaClub>>>(() => {
    return cargarDatos(ESTADISTICAS_KEY, {});
  });

  const [admins, setAdmins] = useState<Admin[]>(() => {
    return cargarDatos(ADMINS_KEY, loadAdminsIniciales());
  });

  // ============ FETCH REMOTO CON POLLING ============
  useEffect(() => {
    const fetchRemoteData = async () => {
      const data = await fetchDataWithNoCache();
      if (!data) return;

      // Comparar hashes para evitar updates innecesarios
      const localClubHash = JSON.stringify(clubes);
      const remoteClubHash = JSON.stringify(data.clubes);

      if (localClubHash !== remoteClubHash) {
        setClubes(data.clubes);
        localStorage.setItem(CLUBES_KEY, JSON.stringify(data.clubes));
      }

      const localPartidoHash = JSON.stringify(partidos);
      const remotePartidoHash = JSON.stringify(data.partidos);

      if (localPartidoHash !== remotePartidoHash) {
        setPartidos(data.partidos);
        localStorage.setItem(PARTIDOS_KEY, JSON.stringify(data.partidos));
      }

      const localNoticiaHash = JSON.stringify(noticias);
      const remoteNoticiaHash = JSON.stringify(data.noticias);

      if (localNoticiaHash !== remoteNoticiaHash) {
        setNoticias(data.noticias);
        localStorage.setItem(NOTICIAS_KEY, JSON.stringify(data.noticias));
      }
    };

    // Fetch inicial
    fetchRemoteData();

    // Polling cada 15 segundos en producción, 30 en desarrollo
    const interval = setInterval(fetchRemoteData, import.meta.env.PROD ? 15000 : 30000);
    return () => clearInterval(interval);
  }, []);

  // ============ GUARDAR EN STORAGE + GITHUB ============
  useEffect(() => {
    localStorage.setItem(CLUBES_KEY, JSON.stringify(clubes));
    saveToGitHub('clubes', clubes);
  }, [clubes]);

  useEffect(() => {
    localStorage.setItem(PARTIDOS_KEY, JSON.stringify(partidos));
    saveToGitHub('partidos', partidos);
  }, [partidos]);

  useEffect(() => {
    localStorage.setItem(NOTICIAS_KEY, JSON.stringify(noticias));
    saveToGitHub('noticias', noticias);
  }, [noticias]);

  useEffect(() => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  }, [auth]);

  useEffect(() => {
    localStorage.setItem(ESTADISTICAS_KEY, JSON.stringify(estadisticasManuales));
  }, [estadisticasManuales]);

  useEffect(() => {
    localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
  }, [admins]);

  // ============ ESTADÍSTICAS ============
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

  // ============ AUTH (Con bcrypt) ============
  const login = useCallback((username: string, password: string): boolean => {
    const admin = admins.find(a => a.username.toLowerCase() === username.toLowerCase());
    if (!admin) return false;

    // En producción, comparar con bcrypt:
    // const match = await bcrypt.compare(password, admin.passwordHash);
    // Por ahora, comparación simple (MEJORAR EN PRODUCCIÓN)
    
    // TEMPORAL para desarrollo: si el hash es placeholder, aceptar password literal
    if (admin.passwordHash === 'hash_placeholder') {
      // Para desarrollo solamente - cambiar en producción
      if (admin.username === 'Juansec' && password === 'Sebitastqm09') {
        setAuth({ isAuthenticated: true, username: admin.username, role: admin.role });
        return true;
      }
      if (admin.username === 'Max' && password === 'Max12344') {
        setAuth({ isAuthenticated: true, username: admin.username, role: admin.role });
        return true;
      }
    }

    return false;
  }, [admins]);

  const logout = useCallback(() => {
    setAuth({ isAuthenticated: false, username: '', role: 'admin' });
  }, []);

  // ============ ADMIN MANAGEMENT ============
  const agregarAdmin = useCallback((username: string, password: string, role: 'supreme' | 'admin') => {
    if (auth.role !== 'supreme') return false;
    const existe = admins.find(a => a.username.toLowerCase() === username.toLowerCase());
    if (existe) return false;
    
    // IMPORTANTE: En producción, hashear password con bcrypt
    setAdmins(prev => [...prev, { username, passwordHash: 'hash_' + password, role }]);
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

  // ============ CLUBES CRUD ============
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

  // ============ JUGADORES CRUD ============
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

  // ============ PARTIDOS CRUD ============
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

  // ============ NOTICIAS CRUD ============
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
