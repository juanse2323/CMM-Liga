import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Save, RotateCcw, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import type { Partido, Club } from '@/types';

interface RegistroResultadosProps {
  partidos: Partido[];
  registrarResultado: (partidoId: string, golesLocal: number, golesVisitante: number) => void;
  resetPartido: (partidoId: string) => void;
  getClubById: (id: string) => { nombre: string; logoUrl: string } | undefined;
  clubes: Club[];
}

export default function RegistroResultados({ partidos, registrarResultado, resetPartido, getClubById, clubes }: RegistroResultadosProps) {
  const [editando, setEditando] = useState<string | null>(null);
  const [golesLocal, setGolesLocal] = useState<number>(0);
  const [golesVisitante, setGolesVisitante] = useState<number>(0);
  const [mensaje, setMensaje] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [resultadoTexto, setResultadoTexto] = useState('');

  const buscarClubPorNombre = (nombre: string) => {
    const buscar = nombre.toUpperCase().trim();
    return clubes.find(c => c.nombre.toUpperCase().includes(buscar));
  };

  const analizarResultadoTexto = () => {
    const regex = /^([A-Za-zÁÉÍÓÚÑ\s]+)\s+(\d+)\s*-\s*(\d+)\s+([A-Za-zÁÉÍÓÚÑ\s]+)$/;
    const match = resultadoTexto.match(regex);
    
    if (!match) {
      setMensaje({ type: 'error', text: 'Formato inválido. Ejemplo: PASTO 0-1 VAMERICA' });
      setTimeout(() => setMensaje(null), 3000);
      return;
    }

    const equipoLocal = buscarClubPorNombre(match[1]);
    const equipoVisitante = buscarClubPorNombre(match[4]);
    const golesLocalTexto = parseInt(match[2]);
    const golesVisitanteTexto = parseInt(match[3]);

    if (!equipoLocal) {
      setMensaje({ type: 'error', text: `No se encontró el equipo local: ${match[1]}` });
      setTimeout(() => setMensaje(null), 3000);
      return;
    }
    if (!equipoVisitante) {
      setMensaje({ type: 'error', text: `No se encontró el equipo visitante: ${match[4]}` });
      setTimeout(() => setMensaje(null), 3000);
      return;
    }

    const partido = partidos.find(p => 
      ((p.localId === equipoLocal.id && p.visitanteId === equipoVisitante.id) ||
       (p.localId === equipoVisitante.id && p.visitanteId === equipoLocal.id)) &&
      !p.jugado
    );

    if (!partido) {
      const partidoJugado = partidos.find(p => 
        ((p.localId === equipoLocal.id && p.visitanteId === equipoVisitante.id) ||
         (p.localId === equipoVisitante.id && p.visitanteId === equipoLocal.id))
      );
      if (partidoJugado) {
        setMensaje({ type: 'error', text: 'Este partido ya tiene resultado registrado' });
      } else {
        setMensaje({ type: 'error', text: 'No hay partido programado entre estos equipos' });
      }
      setTimeout(() => setMensaje(null), 3000);
      return;
    }

    const esLocalOriginal = partido.localId === equipoLocal.id;
    const gl = esLocalOriginal ? golesLocalTexto : golesVisitanteTexto;
    const gv = esLocalOriginal ? golesVisitanteTexto : golesLocalTexto;

    registrarResultado(partido.id, gl, gv);
    setResultadoTexto('');
    setMensaje({ type: 'success', text: `Resultado registrado: ${equipoLocal.nombre} ${golesLocalTexto} - ${golesVisitanteTexto} ${equipoVisitante.nombre}` });
    setTimeout(() => setMensaje(null), 3000);
  };

  const partidosPendientes = partidos.filter(p => !p.jugado);
  const partidosJugados = partidos.filter(p => p.jugado);

  const startEdit = (partido: Partido) => {
    setEditando(partido.id);
    setGolesLocal(partido.golesLocal ?? 0);
    setGolesVisitante(partido.golesVisitante ?? 0);
  };

  const handleSave = (partidoId: string) => {
    if (golesLocal < 0 || golesVisitante < 0) {
      setMensaje({ type: 'error', text: 'Los goles no pueden ser negativos' });
      return;
    }
    registrarResultado(partidoId, golesLocal, golesVisitante);
    setEditando(null);
    setMensaje({ type: 'success', text: 'Resultado registrado correctamente' });
    setTimeout(() => setMensaje(null), 3000);
  };

  const handleReset = (partidoId: string) => {
    resetPartido(partidoId);
    setEditando(null);
    setMensaje({ type: 'success', text: 'Partido reseteado' });
    setTimeout(() => setMensaje(null), 3000);
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
          Registro de Resultados
        </h1>
        <p className="text-ccm-silver text-sm">
          Ingresa los marcadores para actualizar la tabla automáticamente
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-xl p-5 mb-8"
      >
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-ccm-accent" />
          Analizador Rápido de Resultados
        </h3>
        <p className="text-xs text-ccm-silver mb-4">
          Escribe el resultado en formato: <span className="text-ccm-accent font-mono">EQUIPO_LOCAL GOLES-GOLES EQUIPO_VISITANTE</span>
          <br />Ejemplo: <span className="text-ccm-accent font-mono">PASTO 0-1 VAMERICA</span>
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            value={resultadoTexto}
            onChange={(e) => setResultadoTexto(e.target.value)}
            placeholder="PASTO 0-1 VAMERICA"
            className="flex-1 px-4 py-3 rounded-xl bg-ccm-dark border border-white/10 text-white placeholder:text-ccm-silver/50 focus:outline-none focus:border-ccm-accent focus:ring-1 focus:ring-ccm-accent/30 transition-all font-mono"
            onKeyDown={(e) => e.key === 'Enter' && analizarResultadoTexto()}
          />
          <button
            onClick={analizarResultadoTexto}
            className="px-6 py-3 bg-ccm-accent text-ccm-black rounded-xl font-semibold text-sm hover:bg-ccm-accent-light transition-all flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Analizar
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {clubes.map(c => (
            <span key={c.id} className="text-xs px-2 py-1 bg-ccm-dark rounded text-ccm-silver">
              {c.nombre.toUpperCase()}
            </span>
          ))}
        </div>
      </motion.div>

      {mensaje && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`mb-6 flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${
            mensaje.type === 'success'
              ? 'bg-green-500/10 border border-green-500/20 text-green-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}
        >
          {mensaje.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {mensaje.text}
        </motion.div>
      )}

      {/* Partidos pendientes */}
      {partidosPendientes.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-ccm-accent uppercase tracking-wider mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Pendientes de Resultado
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {partidosPendientes.map((partido) => {
                const local = getClubById(partido.localId);
                const visitante = getClubById(partido.visitanteId);
                if (!local || !visitante) return null;
                const isEditing = editando === partido.id;

                return (
                  <motion.div
                    key={partido.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="glass-card rounded-xl p-5 border-l-2 border-l-yellow-500/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-ccm-silver">Jornada {partido.jornada}</span>
                      <span className="text-xs text-ccm-silver">
                        {new Date(partido.fecha).toLocaleDateString('es-CO')} - {partido.hora}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Local */}
                      <div className="flex items-center gap-3 flex-1">
                        <img src={local.logoUrl} alt={local.nombre} className="w-10 h-10 object-contain" />
                        <span className="text-sm font-semibold text-white">{local.nombre}</span>
                      </div>

                      {/* Score input or display */}
                      <div className="flex items-center gap-3 mx-4">
                        {isEditing ? (
                          <>
                            <input
                              type="number"
                              min={0}
                              value={golesLocal}
                              onChange={(e) => setGolesLocal(Number(e.target.value))}
                              className="w-16 h-12 text-center text-2xl font-bold text-white bg-ccm-dark border border-ccm-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-ccm-accent/30"
                            />
                            <span className="text-xl text-ccm-silver">-</span>
                            <input
                              type="number"
                              min={0}
                              value={golesVisitante}
                              onChange={(e) => setGolesVisitante(Number(e.target.value))}
                              className="w-16 h-12 text-center text-2xl font-bold text-white bg-ccm-dark border border-ccm-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-ccm-accent/30"
                            />
                          </>
                        ) : (
                          <span className="text-sm text-ccm-silver bg-ccm-dark px-4 py-2 rounded-lg">VS</span>
                        )}
                      </div>

                      {/* Visitante */}
                      <div className="flex items-center gap-3 flex-1 justify-end">
                        <span className="text-sm font-semibold text-white">{visitante.nombre}</span>
                        <img src={visitante.logoUrl} alt={visitante.nombre} className="w-10 h-10 object-contain" />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-white/[0.05]">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => setEditando(null)}
                            className="px-4 py-2 text-xs text-ccm-silver hover:text-white transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => handleSave(partido.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-ccm-accent text-ccm-black rounded-lg text-xs font-semibold hover:bg-ccm-accent-light transition-all"
                          >
                            <Save className="w-3 h-3" />
                            Guardar Resultado
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startEdit(partido)}
                          className="flex items-center gap-2 px-4 py-2 bg-ccm-accent/10 text-ccm-accent rounded-lg text-xs font-semibold hover:bg-ccm-accent/20 transition-all"
                        >
                          <Trophy className="w-3 h-3" />
                          Ingresar Resultado
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Partidos jugados */}
      {partidosJugados.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Resultados Registrados
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {partidosJugados.map((partido) => {
                const local = getClubById(partido.localId);
                const visitante = getClubById(partido.visitanteId);
                if (!local || !visitante) return null;

                return (
                  <motion.div
                    key={partido.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card rounded-xl p-5 border-l-2 border-l-green-500/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-ccm-silver">Jornada {partido.jornada}</span>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs text-green-400">
                          <CheckCircle className="w-3 h-3" />
                          Finalizado
                        </span>
                        <button
                          onClick={() => handleReset(partido.id)}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-yellow-400 hover:bg-yellow-400/10 rounded transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Reset
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <img src={local.logoUrl} alt={local.nombre} className="w-10 h-10 object-contain" />
                        <span className="text-sm font-semibold text-white">{local.nombre}</span>
                      </div>
                      <div className="flex items-center gap-3 mx-4">
                        <span className={`text-2xl font-bold ${partido.golesLocal! > partido.golesVisitante! ? 'text-ccm-accent' : 'text-white'}`}>
                          {partido.golesLocal}
                        </span>
                        <span className="text-ccm-silver">-</span>
                        <span className={`text-2xl font-bold ${partido.golesVisitante! > partido.golesLocal! ? 'text-ccm-accent' : 'text-white'}`}>
                          {partido.golesVisitante}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 flex-1 justify-end">
                        <span className="text-sm font-semibold text-white">{visitante.nombre}</span>
                        <img src={visitante.logoUrl} alt={visitante.nombre} className="w-10 h-10 object-contain" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {partidos.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 text-ccm-silver/30 mx-auto mb-4" />
          <p className="text-ccm-silver">No hay partidos programados</p>
          <p className="text-ccm-silver/50 text-sm mt-1">Ve a "Partidos" para programar encuentros</p>
        </div>
      )}
    </div>
  );
}
