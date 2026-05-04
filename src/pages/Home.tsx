import { useState, useEffect } from 'react';
import Header from '@/components/public/Header';
import Hero from '@/components/public/Hero';
import Ticker from '@/components/public/Ticker';
import Noticias from '@/components/public/Noticias';
import TablaPosiciones from '@/components/public/TablaPosiciones';
import Footer from '@/components/public/Footer';
import JugadoresClub from '@/components/public/JugadoresClub';
import { useLigaCCM } from '@/hooks/useLigaCCM';
import { Trophy, Users, CalendarDays, Newspaper, Info } from 'lucide-react';

const TABS = [
  { id: 'info', label: 'INFO', icon: Info },
  { id: 'tabla', label: 'TABLA', icon: Trophy },
  { id: 'partidos', label: 'PARTIDOS', icon: CalendarDays },
  { id: 'noticias', label: 'NOTICIAS', icon: Newspaper },
  { id: 'clubes', label: 'JUGADORES', icon: Users },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('info');
  const [clubSeleccionado, setClubSeleccionado] = useState<string | null>(null);
  const { clubes, partidos, noticias, estadisticas, getClubById } = useLigaCCM();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const tab = TABS.find(t => t.id === hash);
      if (tab) {
        setActiveTab(tab.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-ccm-black">
      <Header />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-wrap gap-2 sm:gap-2 mb-6 sm:mb-8 justify-center">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); if (tab.id !== 'clubes') setClubSeleccionado(null); }}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-ccm-accent text-ccm-black shadow-glow'
                  : 'bg-white/10 text-ccm-silver hover:bg-white/20 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'info' && (
          <>
            <Hero totalClubes={clubes.length} totalPartidos={partidos.length} />
            <Ticker partidos={partidos} getClubById={getClubById} />
          </>
        )}

        {activeTab === 'tabla' && (
          <TablaPosiciones estadisticas={estadisticas} clubes={clubes} />
        )}

        {activeTab === 'partidos' && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-4 sm:mb-6">PARTIDOS</h2>
            {partidos.map((partido) => {
              const local = getClubById(partido.localId);
              const visitante = getClubById(partido.visitanteId);
              return (
                <div key={partido.id} className="glass-card rounded-xl p-4 sm:p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-ccm-dark flex items-center justify-center overflow-hidden flex-shrink-0 p-1.5">
                        {local?.logoUrl ? <img src={local.logoUrl} className="w-full h-full object-contain" alt="" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} /> : <Users className="w-6 h-6 text-ccm-silver" />}
                      </div>
                      <span className="text-white font-medium text-sm sm:text-base truncate">{local?.nombre}</span>
                    </div>
                    <div className="px-4 sm:px-5 py-2 bg-ccm-dark rounded-lg text-center flex-shrink-0">
                      {partido.jugado ? (
                        <span className="text-xl sm:text-2xl font-bold text-ccm-accent">{partido.golesLocal} - {partido.golesVisitante}</span>
                      ) : (
                        <span className="text-ccm-silver text-xs sm:text-sm">{partido.fecha.slice(5)}<br/>{partido.hora}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                      <span className="text-white font-medium text-sm sm:text-base truncate">{visitante?.nombre}</span>
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-ccm-dark flex items-center justify-center overflow-hidden flex-shrink-0 p-1.5">
                        {visitante?.logoUrl ? <img src={visitante.logoUrl} className="w-full h-full object-contain" alt="" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} /> : <Users className="w-6 h-6 text-ccm-silver" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'noticias' && (
          <Noticias noticias={noticias} />
        )}

        {activeTab === 'clubes' && (
          <JugadoresClub 
            clubes={clubes} 
            clubSeleccionado={clubSeleccionado} 
            setClubSeleccionado={setClubSeleccionado} 
          />
        )}
      </div>

      <Footer />
    </div>
  );
}
