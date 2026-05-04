export interface Jugador {
  id: string;
  nombre: string;
  posicion: string;
  numero: string;
}

export interface Club {
  id: string;
  nombre: string;
  logoUrl: string;
  fundado?: string;
  estadio?: string;
  jugadores?: Jugador[];
}

export interface Partido {
  id: string;
  localId: string;
  visitanteId: string;
  fecha: string;
  hora: string;
  golesLocal: number | null;
  golesVisitante: number | null;
  jugado: boolean;
  jornada: number;
}

export interface EstadisticaClub {
  clubId: string;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  gf: number;
  gc: number;
  dg: number;
  pts: number;
}

export interface Noticia {
  id: string;
  titulo: string;
  subtitulo: string;
  contenido: string;
  imagenUrl: string;
  fecha: string;
  categoria: string;
  destacada: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  username: string;
  role: 'supreme' | 'admin';
}

export interface Admin {
  username: string;
  password: string;
  role: 'supreme' | 'admin';
}

export const CATEGORIAS_NOTICIA = [
  'Partido',
  'Transferencia',
  'Lesión',
  'Declaración',
  'Torneo',
  'General',
] as const;

export type CategoriaNoticia = (typeof CATEGORIAS_NOTICIA)[number];
