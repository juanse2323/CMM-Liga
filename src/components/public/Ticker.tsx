import { motion } from 'framer-motion';
import { Clock, Play, CheckCircle } from 'lucide-react';
import type { Partido } from '@/types';

interface TickerProps {
  partidos: Partido[];
  getClubById: (id: string) => { nombre: string; logoUrl: string } | undefined;
}

export default function Ticker({ partidos, getClubById }: TickerProps) {
  const partidosOrdenados = [...partidos].sort((a, b) => {
    if (a.jugado !== b.jugado) return a.jugado ? 1 : -1;
    return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
  });

  const jugados = partidosOrdenados.filter(p => p.jugado);
  const pendientes = partidosOrdenados.filter(p => !p.jugado);

  return (
    <section id="ticker" className="py-16 bg-ccm-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-ccm-accent rounded-full" />
            <h2 className="text-3xl font-bold font-display text-white">Resultados & Fixture</h2>
          </div>
          <p className="text-ccm-silver ml-4">Todos los partidos de la temporada 2026</p>
        </motion.div>

        {/* Partidos jugados */}
        {jugados.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-4 h-4 text-ccm-accent" />
              <h3 className="text-sm font-semibold text-ccm-accent uppercase tracking-wider">Finalizados</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jugados.map((partido, idx) => {
                const local = getClubById(partido.localId);
                const visitante = getClubById(partido.visitanteId);
                if (!local || !visitante) return null;
                return (
                  <motion.div
                    key={partido.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="glass-card rounded-xl p-5 hover-lift"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-ccm-silver">Jornada {partido.jornada}</span>
                      <div className="flex items-center gap-1 text-xs text-ccm-accent">
                        <CheckCircle className="w-3 h-3" />
                        Final
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <img src={local.logoUrl} alt={local.nombre} className="w-10 h-10 object-contain" />
                        <span className="text-sm font-semibold text-white truncate">{local.nombre}</span>
                      </div>
                      <div className="flex items-center gap-2 mx-4">
                        <span className={`text-2xl font-black font-display ${partido.golesLocal! > partido.golesVisitante! ? 'text-ccm-accent' : 'text-white'}`}>
                          {partido.golesLocal}
                        </span>
                        <span className="text-ccm-silver">-</span>
                        <span className={`text-2xl font-black font-display ${partido.golesVisitante! > partido.golesLocal! ? 'text-ccm-accent' : 'text-white'}`}>
                          {partido.golesVisitante}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 flex-1 justify-end">
                        <span className="text-sm font-semibold text-white truncate">{visitante.nombre}</span>
                        <img src={visitante.logoUrl} alt={visitante.nombre} className="w-10 h-10 object-contain" />
                      </div>
                    </div>
                    <div className="text-center mt-2 text-xs text-ccm-silver">
                      {new Date(partido.fecha).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Partidos pendientes */}
        {pendientes.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-ccm-silver" />
              <h3 className="text-sm font-semibold text-ccm-silver uppercase tracking-wider">Próximos</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendientes.slice(0, 6).map((partido, idx) => {
                const local = getClubById(partido.localId);
                const visitante = getClubById(partido.visitanteId);
                if (!local || !visitante) return null;
                return (
                  <motion.div
                    key={partido.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="glass-card rounded-xl p-5 hover-lift border-l-2 border-l-ccm-accent/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-ccm-silver">Jornada {partido.jornada}</span>
                      <div className="flex items-center gap-1 text-xs text-ccm-silver">
                        <Play className="w-3 h-3" />
                        Pendiente
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <img src={local.logoUrl} alt={local.nombre} className="w-10 h-10 object-contain" />
                        <span className="text-sm font-semibold text-white truncate">{local.nombre}</span>
                      </div>
                      <div className="flex items-center gap-2 mx-4">
                        <span className="text-xs text-ccm-silver bg-ccm-gray px-2 py-1 rounded">VS</span>
                      </div>
                      <div className="flex items-center gap-3 flex-1 justify-end">
                        <span className="text-sm font-semibold text-white truncate">{visitante.nombre}</span>
                        <img src={visitante.logoUrl} alt={visitante.nombre} className="w-10 h-10 object-contain" />
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-4 mt-3 text-xs text-ccm-silver">
                      <span>{new Date(partido.fecha).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}</span>
                      <span>{partido.hora}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
