import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Tag, ArrowRight, X } from 'lucide-react';
import type { Noticia } from '@/types';

interface NoticiasProps {
  noticias: Noticia[];
}

export default function Noticias({ noticias }: NoticiasProps) {
  const [selectedNoticia, setSelectedNoticia] = useState<Noticia | null>(null);

  const noticiaDestacada = noticias.find(n => n.destacada);
  const otrasNoticias = noticias.filter(n => !n.destacada);

  const getCategoriaColor = (cat: string) => {
    const colors: Record<string, string> = {
      'Partido': 'bg-blue-500/20 text-blue-400',
      'Transferencia': 'bg-green-500/20 text-green-400',
      'Lesión': 'bg-red-500/20 text-red-400',
      'Declaración': 'bg-yellow-500/20 text-yellow-400',
      'Torneo': 'bg-ccm-accent/20 text-ccm-accent',
      'General': 'bg-gray-500/20 text-gray-400',
    };
    return colors[cat] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <section id="noticias" className="py-8 sm:py-16 bg-ccm-black">
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
            <h2 className="text-xl sm:text-3xl font-bold font-display text-white">Noticias</h2>
          </div>
          <p className="text-ccm-silver ml-4 text-sm sm:text-base">Lo último de la Liga CCM</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Noticia destacada */}
          {noticiaDestacada && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1 group cursor-pointer"
              onClick={() => setSelectedNoticia(noticiaDestacada)}
            >
<div className="glass-card rounded-xl sm:rounded-2xl overflow-hidden hover-lift h-full">
                 <div className="relative h-40 sm:h-64 overflow-hidden">
                   <img
                     src={noticiaDestacada.imagenUrl}
                     alt={noticiaDestacada.titulo}
                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-ccm-black via-transparent to-transparent" />
                   <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                     <span className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${getCategoriaColor(noticiaDestacada.categoria)}`}>
                       {noticiaDestacada.categoria}
                     </span>
                   </div>
                   <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                     <div className="flex items-center gap-2 text-[10px] sm:text-xs text-ccm-silver mb-1 sm:mb-2">
                       <Calendar className="w-3 h-3" />
                       {new Date(noticiaDestacada.fecha).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
                     </div>
                     <h3 className="text-base sm:text-xl font-bold text-white leading-tight group-hover:text-ccm-accent transition-colors">
                       {noticiaDestacada.titulo}
                     </h3>
                   </div>
                 </div>
                 <div className="p-3 sm:p-5">
                   <p className="text-ccm-silver text-xs sm:text-sm line-clamp-2">{noticiaDestacada.subtitulo}</p>
                   <div className="flex items-center gap-1 mt-2 sm:mt-3 text-ccm-accent text-xs sm:text-sm font-medium group-hover:gap-2 transition-all">
                     Leer más <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4" />
                   </div>
                 </div>
               </div>
            </motion.div>
          )}

          {/* Otras noticias */}
          <div className="space-y-3 sm:space-y-4">
            {otrasNoticias.slice(0, 4).map((noticia, idx) => (
              <motion.div
                key={noticia.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="glass-card rounded-xl overflow-hidden group cursor-pointer hover-lift"
                onClick={() => setSelectedNoticia(noticia)}
              >
                <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
                  <div className="w-16 sm:w-24 h-16 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={noticia.imagenUrl}
                      alt={noticia.titulo}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getCategoriaColor(noticia.categoria)}`}>
                        {noticia.categoria}
                      </span>
                      <span className="text-[10px] text-ccm-silver flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(noticia.fecha).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2 group-hover:text-ccm-accent transition-colors">
                      {noticia.titulo}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-ccm-silver line-clamp-2 mt-1">{noticia.subtitulo}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de noticia */}
      <AnimatePresence>
        {selectedNoticia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedNoticia(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative h-72">
                <img
                  src={selectedNoticia.imagenUrl}
                  alt={selectedNoticia.titulo}
                  className="w-full h-full object-cover rounded-t-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ccm-black via-transparent to-transparent rounded-t-2xl" />
                <button
                  onClick={() => setSelectedNoticia(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoriaColor(selectedNoticia.categoria)}`}>
                    <Tag className="w-3 h-3 inline mr-1" />
                    {selectedNoticia.categoria}
                  </span>
                  <span className="text-xs text-ccm-silver flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(selectedNoticia.fecha).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{selectedNoticia.titulo}</h3>
                <p className="text-ccm-silver leading-relaxed">{selectedNoticia.contenido}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
