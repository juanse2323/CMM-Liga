import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Save, Calendar, CheckCircle, Clock } from 'lucide-react';
import type { Club, Partido } from '@/types';

interface GestionPartidosProps {
  clubes: Club[];
  partidos: Partido[];
  programarPartido: (localId: string, visitanteId: string, fecha: string, hora: string, jornada: number) => void;
  eliminarPartido: (id: string) => void;
  getClubById: (id: string) => { nombre: string; logoUrl: string } | undefined;
}

export default function GestionPartidos({ clubes, partidos, programarPartido, eliminarPartido, getClubById }: GestionPartidosProps) {
  const [showForm, setShowForm] = useState(false);
  const [localId, setLocalId] = useState('');
  const [visitanteId, setVisitanteId] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [jornada, setJornada] = useState(1);

  const resetForm = () => {
    setLocalId('');
    setVisitanteId('');
    setFecha('');
    setHora('');
    setJornada(1);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localId || !visitanteId || !fecha || !hora || localId === visitanteId) return;
    programarPartido(localId, visitanteId, fecha, hora, jornada);
    resetForm();
  };

  const partidosOrdenados = [...partidos].sort((a, b) => {
    if (a.jugado !== b.jugado) return a.jugado ? 1 : -1;
    return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
  });

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold font-display text-white mb-1 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-ccm-accent" />
            Programar Partidos
          </h1>
          <p className="text-ccm-silver text-sm">{partidos.length} partidos programados</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-ccm-accent text-ccm-black rounded-lg font-medium text-sm hover:bg-ccm-accent-light hover:shadow-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          Nuevo Partido
        </button>
      </motion.div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Programar Nuevo Partido</h3>
                <button onClick={resetForm} className="text-ccm-silver hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ccm-silver mb-2">Equipo Local *</label>
                    <select
                      value={localId}
                      onChange={(e) => setLocalId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-ccm-dark border border-white/10 text-white focus:outline-none focus:border-ccm-accent focus:ring-1 focus:ring-ccm-accent/30 transition-all"
                      required
                    >
                      <option value="">Seleccionar...</option>
                      {clubes.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ccm-silver mb-2">Equipo Visitante *</label>
                    <select
                      value={visitanteId}
                      onChange={(e) => setVisitanteId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-ccm-dark border border-white/10 text-white focus:outline-none focus:border-ccm-accent focus:ring-1 focus:ring-ccm-accent/30 transition-all"
                      required
                    >
                      <option value="">Seleccionar...</option>
                      {clubes.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ccm-silver mb-2">Fecha *</label>
                    <input
                      type="date"
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-ccm-dark border border-white/10 text-white focus:outline-none focus:border-ccm-accent focus:ring-1 focus:ring-ccm-accent/30 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ccm-silver mb-2">Hora *</label>
                    <input
                      type="time"
                      value={hora}
                      onChange={(e) => setHora(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-ccm-dark border border-white/10 text-white focus:outline-none focus:border-ccm-accent focus:ring-1 focus:ring-ccm-accent/30 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ccm-silver mb-2">Jornada *</label>
                    <input
                      type="number"
                      min={1}
                      value={jornada}
                      onChange={(e) => setJornada(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl bg-ccm-dark border border-white/10 text-white focus:outline-none focus:border-ccm-accent focus:ring-1 focus:ring-ccm-accent/30 transition-all"
                      required
                    />
                  </div>
                </div>
                {localId && visitanteId && localId === visitanteId && (
                  <p className="text-red-400 text-sm">El equipo local y visitante deben ser diferentes</p>
                )}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-sm text-ccm-silver hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!localId || !visitanteId || localId === visitanteId || !fecha || !hora}
                    className="flex items-center gap-2 px-6 py-2 bg-ccm-accent text-ccm-black rounded-lg font-medium text-sm hover:bg-ccm-accent-light hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    Programar
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de partidos */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {partidosOrdenados.map((partido) => {
            const local = getClubById(partido.localId);
            const visitante = getClubById(partido.visitanteId);
            if (!local || !visitante) return null;
            return (
              <motion.div
                key={partido.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-ccm-silver">Jornada {partido.jornada}</span>
                    {partido.jugado ? (
                      <span className="flex items-center gap-1 text-xs text-green-400">
                        <CheckCircle className="w-3 h-3" />
                        Finalizado
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-yellow-400">
                        <Clock className="w-3 h-3" />
                        Pendiente
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => eliminarPartido(partido.id)}
                    className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <img src={local.logoUrl} alt={local.nombre} className="w-8 h-8 object-contain" />
                    <span className="text-sm font-semibold text-white">{local.nombre}</span>
                  </div>
                  <div className="mx-4 text-center">
                    {partido.jugado && partido.golesLocal !== null && partido.golesVisitante !== null ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-white">{partido.golesLocal}</span>
                        <span className="text-ccm-silver">-</span>
                        <span className="text-lg font-bold text-white">{partido.golesVisitante}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-ccm-silver bg-ccm-dark px-3 py-1 rounded">VS</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-1 justify-end">
                    <span className="text-sm font-semibold text-white">{visitante.nombre}</span>
                    <img src={visitante.logoUrl} alt={visitante.nombre} className="w-8 h-8 object-contain" />
                  </div>
                </div>
                <div className="text-center mt-2 text-xs text-ccm-silver">
                  {new Date(partido.fecha).toLocaleDateString('es-CO')} - {partido.hora}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
