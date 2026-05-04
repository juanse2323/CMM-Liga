import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Save, RotateCcw } from 'lucide-react';
import type { Club, EstadisticaClub } from '@/types';

interface GestionEstadisticasProps {
  clubes: Club[];
  estadisticas: EstadisticaClub[];
  editarEstadisticas: (clubId: string, datos: Partial<EstadisticaClub>) => void;
}

export default function GestionEstadisticas({ clubes, estadisticas, editarEstadisticas }: GestionEstadisticasProps) {
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<EstadisticaClub>>({});

  const getEstadistica = (clubId: string) => {
    return estadisticas.find(e => e.clubId === clubId);
  };

  const startEdit = (clubId: string) => {
    const est = getEstadistica(clubId);
    if (est) {
      setFormData({ ...est });
      setEditandoId(clubId);
    }
  };

  const handleSave = (clubId: string) => {
    editarEstadisticas(clubId, formData);
    setEditandoId(null);
  };

  const resetStats = (clubId: string) => {
    editarEstadisticas(clubId, { pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 });
    setEditandoId(null);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold font-display text-white mb-1 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-ccm-accent" />
          Editar Tabla de Posiciones
        </h1>
        <p className="text-ccm-silver text-sm">
          Modifica manualmente los puntos y estadísticas de cada equipo
        </p>
      </motion.div>

      <div className="space-y-3">
        {clubes.map((club, idx) => {
          const est = getEstadistica(club.id);
          const isEditing = editandoId === club.id;

          return (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card rounded-xl p-4"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-ccm-dark flex items-center justify-center overflow-hidden">
                  {club.logoUrl ? (
                    <img src={club.logoUrl} alt={club.nombre} className="w-full h-full object-contain p-1" />
                  ) : (
                    <Trophy className="w-5 h-5 text-ccm-silver" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-white font-semibold">{club.nombre}</span>
                  <div className="text-xs text-ccm-silver">Posición #{idx + 1}</div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-ccm-accent">{est?.pts || 0}</span>
                  <div className="text-xs text-ccm-silver">pts</div>
                </div>
              </div>

              {isEditing ? (
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-4">
                  <div className="text-center">
                    <label className="text-[10px] text-ccm-silver block">PJ</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.pj ?? 0}
                      onChange={(e) => setFormData({ ...formData, pj: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1 text-center text-sm bg-ccm-dark border border-white/10 rounded text-white"
                    />
                  </div>
                  <div className="text-center">
                    <label className="text-[10px] text-green-400 block">PG</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.pg ?? 0}
                      onChange={(e) => setFormData({ ...formData, pg: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1 text-center text-sm bg-ccm-dark border border-white/10 rounded text-white"
                    />
                  </div>
                  <div className="text-center">
                    <label className="text-[10px] text-yellow-400 block">PE</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.pe ?? 0}
                      onChange={(e) => setFormData({ ...formData, pe: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1 text-center text-sm bg-ccm-dark border border-white/10 rounded text-white"
                    />
                  </div>
                  <div className="text-center">
                    <label className="text-[10px] text-red-400 block">PP</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.pp ?? 0}
                      onChange={(e) => setFormData({ ...formData, pp: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1 text-center text-sm bg-ccm-dark border border-white/10 rounded text-white"
                    />
                  </div>
                  <div className="text-center">
                    <label className="text-[10px] text-ccm-silver block">GF</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.gf ?? 0}
                      onChange={(e) => setFormData({ ...formData, gf: parseInt(e.target.value) || 0, dg: (parseInt(e.target.value) || 0) - (formData.gc ?? 0) })}
                      className="w-full px-2 py-1 text-center text-sm bg-ccm-dark border border-white/10 rounded text-white"
                    />
                  </div>
                  <div className="text-center">
                    <label className="text-[10px] text-ccm-silver block">GC</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.gc ?? 0}
                      onChange={(e) => setFormData({ ...formData, gc: parseInt(e.target.value) || 0, dg: (formData.gf ?? 0) - (parseInt(e.target.value) || 0) })}
                      className="w-full px-2 py-1 text-center text-sm bg-ccm-dark border border-white/10 rounded text-white"
                    />
                  </div>
                  <div className="text-center">
                    <label className="text-[10px] text-ccm-silver block">DG</label>
                    <input
                      type="number"
                      value={formData.dg ?? 0}
                      onChange={(e) => setFormData({ ...formData, dg: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1 text-center text-sm bg-ccm-dark border border-white/10 rounded text-white"
                    />
                  </div>
                  <div className="text-center">
                    <label className="text-[10px] text-ccm-accent block">PTS</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.pts ?? 0}
                      onChange={(e) => setFormData({ ...formData, pts: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1 text-center text-sm bg-ccm-dark border border-ccm-accent rounded text-white font-bold"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-4 text-xs text-center">
                  <div className="text-ccm-silver">PJ: {est?.pj || 0}</div>
                  <div className="text-green-400">PG: {est?.pg || 0}</div>
                  <div className="text-yellow-400">PE: {est?.pe || 0}</div>
                  <div className="text-red-400">PP: {est?.pp || 0}</div>
                  <div className="text-ccm-silver">GF: {est?.gf || 0}</div>
                  <div className="text-ccm-silver">GC: {est?.gc || 0}</div>
                  <div className="text-ccm-silver">DG: {est?.dg || 0}</div>
                  <div className="text-white font-bold">PTS: {est?.pts || 0}</div>
                </div>
              )}

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setEditandoId(null)}
                      className="flex-1 py-2 text-xs text-ccm-silver hover:text-white transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleSave(club.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-ccm-accent text-ccm-black rounded-lg text-xs font-semibold hover:bg-ccm-accent-light"
                    >
                      <Save className="w-3 h-3" />
                      Guardar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(club.id)}
                      className="flex-1 py-2 text-xs text-ccm-accent bg-ccm-accent/10 rounded-lg hover:bg-ccm-accent/20"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => resetStats(club.id)}
                      className="px-3 py-2 text-xs text-yellow-400 bg-yellow-400/10 rounded-lg hover:bg-yellow-400/20"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}