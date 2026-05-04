import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Pencil, Trash2, X, Save, Shirt } from 'lucide-react';
import type { Club, Jugador } from '@/types';

interface GestionJugadoresProps {
  clubes: Club[];
  agregarJugador: (clubId: string, nombre: string, posicion: string, numero: string) => void;
  eliminarJugador: (clubId: string, jugadorId: string) => void;
  editarJugador: (clubId: string, jugadorId: string, nombre: string, posicion: string, numero: string) => void;
}

const POSICIONES = ['POR', 'DEF', 'MED', 'DEL', 'CAM', 'CAI', 'CAD', 'LD', 'LI', 'MC', 'DC', 'SD'];

export default function GestionJugadores({ clubes, agregarJugador, eliminarJugador, editarJugador }: GestionJugadoresProps) {
  const [clubSeleccionado, setClubSeleccionado] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [posicion, setPosicion] = useState('POR');
  const [numero, setNumero] = useState('');

  const club = clubes.find(c => c.id === clubSeleccionado);
  const jugadores = club?.jugadores || [];

  const resetForm = () => {
    setNombre('');
    setPosicion('POR');
    setNumero('');
    setEditando(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !clubSeleccionado) return;
    if (editando) {
      editarJugador(clubSeleccionado, editando, nombre.trim(), posicion, numero.trim());
    } else {
      agregarJugador(clubSeleccionado, nombre.trim(), posicion, numero.trim());
    }
    resetForm();
  };

  const startEdit = (jugador: Jugador) => {
    setNombre(jugador.nombre);
    setPosicion(jugador.posicion);
    setNumero(jugador.numero);
    setEditando(jugador.id);
    setShowForm(true);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold font-display text-white mb-1 flex items-center gap-2">
          <Shirt className="w-6 h-6 text-ccm-accent" />
          Gestión de Jugadores
        </h1>
        <p className="text-ccm-silver text-sm">Administra los planteles de cada equipo</p>
      </motion.div>

      {/* Selector de club */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-ccm-silver mb-2">Seleccionar Equipo</label>
        <div className="flex flex-wrap gap-2">
          {clubes.map(c => (
            <button
              key={c.id}
              onClick={() => { setClubSeleccionado(c.id); setShowForm(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                clubSeleccionado === c.id
                  ? 'bg-ccm-accent text-ccm-black'
                  : 'bg-ccm-dark text-ccm-silver hover:text-white'
              }`}
            >
              <img src={c.logoUrl} alt={c.nombre} className="w-5 h-5 object-contain" />
              {c.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Formulario */}
      {clubSeleccionado && showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 overflow-hidden"
        >
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {editando ? 'Editar Jugador' : 'Agregar Jugador'}
              </h3>
              <button onClick={resetForm} className="text-ccm-silver hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ccm-silver mb-2">Nombre</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre del jugador"
                    className="w-full px-4 py-3 rounded-xl bg-ccm-dark border border-white/10 text-white placeholder:text-ccm-silver/50 focus:outline-none focus:border-ccm-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ccm-silver mb-2">Posición</label>
                  <select
                    value={posicion}
                    onChange={(e) => setPosicion(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-ccm-dark border border-white/10 text-white focus:outline-none focus:border-ccm-accent"
                  >
                    {POSICIONES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ccm-silver mb-2">Número</label>
                  <input
                    type="text"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    placeholder="Ej: 10"
                    className="w-full px-4 py-3 rounded-xl bg-ccm-dark border border-white/10 text-white placeholder:text-ccm-silver/50 focus:outline-none focus:border-ccm-accent"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm text-ccm-silver hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-ccm-accent text-ccm-black rounded-lg font-medium text-sm hover:bg-ccm-accent-light"
                >
                  <Save className="w-4 h-4" />
                  {editando ? 'Guardar' : 'Agregar'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {/* Lista de jugadores */}
      {clubSeleccionado ? (
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-ccm-accent" />
              {club?.nombre} - Plantel ({jugadores.length} jugadores)
            </h3>
            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-ccm-accent text-ccm-black rounded-lg font-medium text-sm hover:bg-ccm-accent-light"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>

          {jugadores.length === 0 ? (
            <p className="text-ccm-silver text-center py-8">No hay jugadores registrados</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {jugadores.map(jugador => (
                <motion.div
                  key={jugador.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-between bg-ccm-dark rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-ccm-accent/20 flex items-center justify-center text-ccm-accent font-bold">
                      {jugador.numero || '?'}
                    </div>
                    <div>
                      <p className="text-white font-medium">{jugador.nombre}</p>
                      <p className="text-xs text-ccm-silver">{jugador.posicion}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEdit(jugador)}
                      className="p-2 text-ccm-silver hover:text-ccm-accent"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => eliminarJugador(clubSeleccionado, jugador.id)}
                      className="p-2 text-ccm-silver hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-ccm-silver/30 mx-auto mb-4" />
          <p className="text-ccm-silver">Selecciona un equipo para ver sus jugadores</p>
        </div>
      )}
    </div>
  );
}