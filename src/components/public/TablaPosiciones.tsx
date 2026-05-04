import { motion } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { EstadisticaClub, Club } from '@/types';

interface TablaPosicionesProps {
  estadisticas: EstadisticaClub[];
  clubes: Club[];
}

export default function TablaPosiciones({ estadisticas, clubes }: TablaPosicionesProps) {
  const getClub = (clubId: string) => clubes.find(c => c.id === clubId);

  const getPosicionClass = (index: number) => {
    if (index === 0) return 'border-l-ccm-accent';
    if (index === 1) return 'border-l-ccm-silver';
    if (index === 2) return 'border-l-amber-600';
    return 'border-l-transparent';
  };

  const getTrendIcon = (index: number, pts: number) => {
    if (pts > 0 && index < 4) return <TrendingUp className="w-3 h-3 text-green-400" />;
    if (index >= estadisticas.length - 2) return <TrendingDown className="w-3 h-3 text-red-400" />;
    return <Minus className="w-3 h-3 text-ccm-silver" />;
  };

  return (
    <section id="tabla" className="py-8 sm:py-16 bg-ccm-darker">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-6 sm:h-8 bg-ccm-accent rounded-full" />
            <h2 className="text-xl sm:text-3xl font-bold font-display text-white">Tabla de Posiciones</h2>
          </div>
          <p className="text-ccm-silver ml-4 text-sm sm:text-base">Clasificación actualizada en tiempo real</p>
        </motion.div>

        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Header - Desktop */}
          <div className="hidden md:grid grid-cols-12 gap-2 px-6 py-4 bg-ccm-black/50 text-xs font-semibold text-ccm-silver uppercase tracking-wider border-b border-white/5">
            <div className="col-span-1">Pos</div>
            <div className="col-span-4">Equipo</div>
            <div className="col-span-1 text-center">PJ</div>
            <div className="col-span-1 text-center">PG</div>
            <div className="col-span-1 text-center">PE</div>
            <div className="col-span-1 text-center">PP</div>
            <div className="col-span-1 text-center">GF</div>
            <div className="col-span-1 text-center">GC</div>
            <div className="col-span-1 text-center">DG</div>
            <div className="col-span-1 text-center">PTS</div>
          </div>
          {/* Header - Mobile */}
          <div className="md:hidden grid grid-cols-4 gap-2 px-4 py-3 bg-ccm-black/50 text-[10px] font-semibold text-ccm-silver uppercase tracking-wider border-b border-white/5">
            <div className="col-span-1">Pos</div>
            <div className="col-span-2">Equipo</div>
            <div className="col-span-1 text-center">PTS</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/[0.03]">
            {estadisticas.map((stat, idx) => {
              const club = getClub(stat.clubId);
              if (!club) return null;
              const isTop3 = idx < 3;

              return (
                <motion.div
                  key={stat.clubId}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: idx * 0.05,
                    layout: { duration: 0.5, ease: 'easeInOut' }
                  }}
                  className={`group grid grid-cols-12 gap-2 px-4 sm:px-6 py-4 items-center border-l-2 ${getPosicionClass(idx)} hover:bg-white/[0.02] transition-colors`}
                >
                  {/* Posición */}
                  <div className="col-span-1 flex items-center gap-1 sm:gap-2">
                    <span className={`text-sm font-bold font-display ${isTop3 ? 'text-ccm-accent' : 'text-ccm-silver'}`}>
                      {idx + 1}
                    </span>
                    {getTrendIcon(idx, stat.pts)}
                  </div>

                  {/* Equipo */}
                  <div className="col-span-4 flex items-center gap-2 sm:gap-3">
                    <div className="relative w-10 h-10 flex-shrink-0 bg-ccm-dark rounded-lg p-1">
                      <img
                        src={club.logoUrl}
                        alt={club.nombre}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=CCM';
                        }}
                      />
                      {idx === 0 && (
                        <Trophy className="absolute -top-2 -right-2 w-4 h-4 text-ccm-accent" />
                      )}
                    </div>
                    <span className="text-sm font-semibold text-white truncate hidden sm:block">{club.nombre}</span>
                    <span className="text-xs font-semibold text-white truncate sm:hidden">{club.nombre.split(' ')[0]}</span>
                  </div>

                  {/* Estadísticas - Desktop */}
                  <div className="hidden md:contents">
                    <div className="col-span-1 text-center text-sm text-ccm-silver">{stat.pj}</div>
                    <div className="col-span-1 text-center text-sm text-green-400">{stat.pg}</div>
                    <div className="col-span-1 text-center text-sm text-yellow-400">{stat.pe}</div>
                    <div className="col-span-1 text-center text-sm text-red-400">{stat.pp}</div>
                    <div className="col-span-1 text-center text-sm text-ccm-silver">{stat.gf}</div>
                    <div className="col-span-1 text-center text-sm text-ccm-silver">{stat.gc}</div>
                    <div className={`col-span-1 text-center text-sm font-semibold ${stat.dg > 0 ? 'text-green-400' : stat.dg < 0 ? 'text-red-400' : 'text-ccm-silver'}`}>
                      {stat.dg > 0 ? '+' : ''}{stat.dg}
                    </div>
                    <div className="col-span-1 text-center">
                      <span className={`text-sm font-black font-display ${isTop3 ? 'text-ccm-accent' : 'text-white'}`}>
                        {stat.pts}
                      </span>
                    </div>
                  </div>

                  {/* Mobile stats */}
                  <div className="md:hidden col-span-1 flex items-center justify-end">
                    <span className="text-sm font-bold text-white">{stat.pts}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Leyenda */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-4 sm:mt-6 text-[10px] sm:text-xs text-ccm-silver">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-ccm-accent" />
            <span>Líder</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-ccm-silver" />
            <span className="hidden sm:inline">2° Puesto</span>
            <span className="sm:hidden">2°</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-600" />
            <span className="hidden sm:inline">3° Puesto</span>
            <span className="sm:hidden">3°</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-400" />
            <span>Alza</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-400" />
            <span>Baja</span>
          </div>
        </div>
      </div>
    </section>
  );
}
