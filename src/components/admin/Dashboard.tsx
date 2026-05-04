import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Trophy, Newspaper, ArrowUpRight, Save, Cloud, CheckCircle } from 'lucide-react';
import type { Club, Partido, EstadisticaClub, Noticia } from '@/types';
import { saveToFirebase } from '@/lib/firebase-db';

interface DashboardProps {
  clubes: Club[];
  partidos: Partido[];
  estadisticas: EstadisticaClub[];
  noticias: Noticia[];
  getClubById: (id: string) => { nombre: string; logoUrl: string } | undefined;
}

export default function Dashboard({ clubes, partidos, estadisticas, noticias, getClubById }: DashboardProps) {
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const guardarTodo = async () => {
    setGuardando(true);
    setError(null);
    
    const results = await Promise.all([
      saveToFirebase('clubes', clubes),
      saveToFirebase('partidos', partidos),
      saveToFirebase('noticias', noticias)
    ]);
    
    setGuardando(false);
    
    if (results.every(r => r)) {
      setGuardado(true);
      setTimeout(() => setGuardado(false), 3000);
    } else {
      setError('Error al guardar. Asegúrate de que Firestore está activado en Firebase Console.');
    }
  };

  const partidosJugados = partidos.filter(p => p.jugado).length;
  const partidosPendientes = partidos.filter(p => !p.jugado).length;
  const lider = estadisticas[0];
  const liderClub = lider ? getClubById(lider.clubId) : null;

  const stats = [
    { label: 'Clubes', value: clubes.length, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Partidos Programados', value: partidos.length, icon: Calendar, color: 'text-ccm-accent', bg: 'bg-ccm-accent/10' },
    { label: 'Partidos Jugados', value: partidosJugados, icon: Trophy, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Noticias', value: noticias.length, icon: Newspaper, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display text-white mb-1">Dashboard</h1>
            <p className="text-ccm-silver text-sm">Resumen general de la Liga CCM</p>
          </div>
          <button
            onClick={guardarTodo}
            disabled={guardando}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              guardado 
                ? 'bg-green-500 text-white' 
                : guardando 
                  ? 'bg-yellow-500 text-white'
                  : 'bg-ccm-accent text-ccm-black hover:bg-ccm-accent-light'
            }`}
          >
            {guardado ? (
              <>
                <CheckCircle className="w-5 h-5" />
                ¡Guardado!
              </>
            ) : guardando ? (
              <>
                <Cloud className="w-5 h-5 animate-pulse" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Guardar Cambios
              </>
            )}
          </button>
          {error && (
            <p className="text-red-400 text-xs mt-2">{error}</p>
          )}
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-ccm-silver" />
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-ccm-silver">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Líder */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-ccm-accent" />
            Líder del Torneo
          </h3>
          {lider && liderClub ? (
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={liderClub.logoUrl} alt={liderClub.nombre} className="w-16 h-16 object-contain" />
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-ccm-accent flex items-center justify-center">
                  <span className="text-xs font-bold text-ccm-black">1</span>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">{liderClub.nombre}</h4>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="text-ccm-accent font-bold">{lider.pts} PTS</span>
                  <span className="text-ccm-silver">{lider.pj} PJ</span>
                  <span className="text-green-400">{lider.pg} PG</span>
                  <span className={`${lider.dg >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    DG {lider.dg > 0 ? '+' : ''}{lider.dg}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-ccm-silver">Aún no hay partidos jugados</p>
          )}
        </motion.div>

        {/* Próximos partidos */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-ccm-accent" />
            Próximos Partidos
          </h3>
          {partidosPendientes > 0 ? (
            <div className="space-y-3">
              {partidos.filter(p => !p.jugado).slice(0, 3).map(partido => {
                const local = getClubById(partido.localId);
                const visitante = getClubById(partido.visitanteId);
                if (!local || !visitante) return null;
                return (
                  <div key={partido.id} className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0">
                    <div className="flex items-center gap-2 flex-1">
                      <img src={local.logoUrl} alt={local.nombre} className="w-6 h-6 object-contain" />
                      <span className="text-sm text-white truncate">{local.nombre}</span>
                    </div>
                    <span className="text-xs text-ccm-silver mx-2">VS</span>
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <span className="text-sm text-white truncate">{visitante.nombre}</span>
                      <img src={visitante.logoUrl} alt={visitante.nombre} className="w-6 h-6 object-contain" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-ccm-silver">No hay partidos pendientes</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
