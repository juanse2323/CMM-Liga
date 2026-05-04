import { useState } from 'react';
import { Shirt, ChevronDown, ChevronUp, Plus, X, Save } from 'lucide-react';
import type { Club, Jugador } from '@/types';

interface JugadoresClubProps {
  clubes: Club[];
  clubSeleccionado: string | null;
  setClubSeleccionado: (id: string | null) => void;
}

export default function JugadoresClub({ clubes, clubSeleccionado, setClubSeleccionado }: JugadoresClubProps) {
  const [jugadoresPorClub, setJugadoresPorClub] = useState<Record<string, Jugador[]>>(() => {
    const saved = localStorage.getItem('ccm_jugadores');
    return saved ? JSON.parse(saved) : {};
  });
  const [showForm, setShowForm] = useState(false);
  const [nuevoJugador, setNuevoJugador] = useState({ nombre: '', posicion: '', numero: '' });
  const [expandedClub, setExpandedClub] = useState<string | null>(null);

  const guardarJugadores = (clubId: string, jugadores: Jugador[]) => {
    const updated = { ...jugadoresPorClub, [clubId]: jugadores };
    setJugadoresPorClub(updated);
    localStorage.setItem('ccm_jugadores', JSON.stringify(updated));
  };

  const agregarJugador = (clubId: string) => {
    if (!nuevoJugador.nombre.trim()) return;
    const jugadores = jugadoresPorClub[clubId] || [];
    guardarJugadores(clubId, [...jugadores, { 
      id: Date.now().toString(), 
      nombre: nuevoJugador.nombre, 
      posicion: nuevoJugador.posicion, 
      numero: nuevoJugador.numero || Math.floor(Math.random() * 99 + 1).toString()
    }]);
    setNuevoJugador({ nombre: '', posicion: '', numero: '' });
    setShowForm(false);
  };

  const eliminarJugador = (clubId: string, jugadorId: string) => {
    const jugadores = (jugadoresPorClub[clubId] || []).filter(j => j.id !== jugadorId);
    guardarJugadores(clubId, jugadores);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white text-center mb-6">JUGADORES POR EQUIPO</h2>
      
      {clubes.map((club) => {
        const jugadores = jugadoresPorClub[club.id] || [];
        const isExpanded = expandedClub === club.id;
        const isSelected = clubSeleccionado === club.id;

        return (
          <div 
            key={club.id}
            className={`glass-card rounded-xl overflow-hidden transition-all ${isSelected ? 'ring-2 ring-ccm-accent' : ''}`}
          >
            <button
              onClick={() => { setExpandedClub(isExpanded ? null : club.id); setClubSeleccionado(isSelected ? null : club.id); }}
              className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-ccm-dark flex items-center justify-center overflow-hidden">
                  {club.logoUrl ? (
                    <img src={club.logoUrl} alt={club.nombre} className="w-full h-full object-contain p-1" />
                  ) : (
                    <Shirt className="w-6 h-6 text-ccm-silver" />
                  )}
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold">{club.nombre}</h3>
                  <p className="text-ccm-silver text-sm">{jugadores.length} jugadores</p>
                </div>
              </div>
              {isExpanded ? <ChevronUp className="w-5 h-5 text-ccm-silver" /> : <ChevronDown className="w-5 h-5 text-ccm-silver" />}
            </button>

            {isExpanded && (
              <div className="p-4 pt-0 border-t border-white/10">
                {jugadores.length === 0 ? (
                  <p className="text-ccm-silver text-center py-4">No hay jugadores registrados</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                    {jugadores.map((jugador) => (
                      <div key={jugador.id} className="bg-ccm-dark rounded-lg p-3 flex items-center justify-between group">
                        <div>
                          <p className="text-white text-sm font-medium">{jugador.nombre}</p>
                          <p className="text-ccm-silver text-xs">{jugador.posicion} #{jugador.numero}</p>
                        </div>
                        <button
                          onClick={() => eliminarJugador(club.id, jugador.id)}
                          className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-300 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full py-2 bg-ccm-accent/20 text-ccm-accent rounded-lg text-sm font-medium hover:bg-ccm-accent/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Agregar Jugador
                  </button>
                )}

                {showForm && (
                  <div className="bg-ccm-dark rounded-lg p-4 mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <input
                        type="text"
                        placeholder="Nombre del jugador"
                        value={nuevoJugador.nombre}
                        onChange={(e) => setNuevoJugador({ ...nuevoJugador, nombre: e.target.value })}
                        className="px-3 py-2 rounded-lg bg-ccm-black border border-white/10 text-white placeholder:text-ccm-silver/50 text-sm focus:outline-none focus:border-ccm-accent"
                      />
                      <input
                        type="text"
                        placeholder="Posición (DEL, MED, DEF, POR)"
                        value={nuevoJugador.posicion}
                        onChange={(e) => setNuevoJugador({ ...nuevoJugador, posicion: e.target.value })}
                        className="px-3 py-2 rounded-lg bg-ccm-black border border-white/10 text-white placeholder:text-ccm-silver/50 text-sm focus:outline-none focus:border-ccm-accent"
                      />
                      <input
                        type="text"
                        placeholder="Número"
                        value={nuevoJugador.numero}
                        onChange={(e) => setNuevoJugador({ ...nuevoJugador, numero: e.target.value })}
                        className="px-3 py-2 rounded-lg bg-ccm-black border border-white/10 text-white placeholder:text-ccm-silver/50 text-sm focus:outline-none focus:border-ccm-accent"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setShowForm(false); setNuevoJugador({ nombre: '', posicion: '', numero: '' }); }}
                        className="px-4 py-2 text-ccm-silver text-sm hover:text-white transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => agregarJugador(club.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-ccm-accent text-ccm-black rounded-lg text-sm font-medium hover:bg-ccm-accent-light"
                      >
                        <Save className="w-4 h-4" /> Guardar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}