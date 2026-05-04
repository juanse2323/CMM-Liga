import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save, Newspaper, Tag, Star, Upload } from 'lucide-react';
import type { Noticia } from '@/types';
import { convertirImagenABase64 } from '@/hooks/useLigaCCM';

interface GestionNoticiasProps {
  noticias: Noticia[];
  agregarNoticia: (noticia: Omit<Noticia, 'id'>) => void;
  editarNoticia: (id: string, datos: Partial<Noticia>) => void;
  eliminarNoticia: (id: string) => void;
}

const CATEGORIAS = ['Partido', 'Transferencia', 'Lesión', 'Declaración', 'Torneo', 'General'];

export default function GestionNoticias({ noticias, agregarNoticia, editarNoticia, eliminarNoticia }: GestionNoticiasProps) {
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [titulo, setTitulo] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [categoria, setCategoria] = useState('General');
  const [destacada, setDestacada] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertirImagenABase64(file);
        setImagenUrl(base64);
      } catch (error) {
        console.error('Error al convertir imagen:', error);
      }
    }
  };

  const resetForm = () => {
    setTitulo('');
    setSubtitulo('');
    setContenido('');
    setImagenUrl('');
    setCategoria('General');
    setDestacada(false);
    setEditando(null);
    setShowForm(false);
  };

  const startEdit = (noticia: Noticia) => {
    setTitulo(noticia.titulo);
    setSubtitulo(noticia.subtitulo);
    setContenido(noticia.contenido);
    setImagenUrl(noticia.imagenUrl);
    setCategoria(noticia.categoria);
    setDestacada(noticia.destacada);
    setEditando(noticia.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !subtitulo.trim()) return;

    const fecha = new Date().toISOString().split('T')[0];
    const datos = {
      titulo: titulo.trim(),
      subtitulo: subtitulo.trim(),
      contenido: contenido.trim(),
      imagenUrl: imagenUrl.trim() || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop',
      fecha,
      categoria,
      destacada,
    };

    if (editando) {
      editarNoticia(editando, datos);
    } else {
      agregarNoticia(datos);
    }
    resetForm();
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold font-display text-white mb-1 flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-ccm-accent" />
            Gestión de Noticias
          </h1>
          <p className="text-ccm-silver text-sm">{noticias.length} noticias publicadas</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-ccm-accent text-ccm-black rounded-lg font-medium text-sm hover:bg-ccm-accent-light hover:shadow-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          Nueva Noticia
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
                <h3 className="text-lg font-semibold text-white">
                  {editando ? 'Editar Noticia' : 'Nueva Noticia'}
                </h3>
                <button onClick={resetForm} className="text-ccm-silver hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ccm-silver mb-2">Título *</label>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Título de la noticia"
                    className="w-full px-4 py-3 rounded-xl bg-ccm-dark border border-white/10 text-white placeholder:text-ccm-silver/50 focus:outline-none focus:border-ccm-accent focus:ring-1 focus:ring-ccm-accent/30 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ccm-silver mb-2">Subtítulo *</label>
                  <input
                    type="text"
                    value={subtitulo}
                    onChange={(e) => setSubtitulo(e.target.value)}
                    placeholder="Breve descripción"
                    className="w-full px-4 py-3 rounded-xl bg-ccm-dark border border-white/10 text-white placeholder:text-ccm-silver/50 focus:outline-none focus:border-ccm-accent focus:ring-1 focus:ring-ccm-accent/30 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ccm-silver mb-2">Contenido</label>
                  <textarea
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    placeholder="Contenido completo de la noticia"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-ccm-dark border border-white/10 text-white placeholder:text-ccm-silver/50 focus:outline-none focus:border-ccm-accent focus:ring-1 focus:ring-ccm-accent/30 transition-all resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-ccm-silver mb-2">Imagen</label>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={imagenUrl}
                        onChange={(e) => setImagenUrl(e.target.value)}
                        placeholder="Pega una URL de imagen..."
                        className="w-full px-4 py-3 rounded-xl bg-ccm-dark border border-white/10 text-white placeholder:text-ccm-silver/50 focus:outline-none focus:border-ccm-accent focus:ring-1 focus:ring-ccm-accent/30 transition-all"
                      />
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*,.png,.jpg,.jpeg,.gif,.webp,.svg"
                          className="hidden"
                          id="noticia-img-upload"
                        />
                        <label
                          htmlFor="noticia-img-upload"
                          className="flex items-center gap-2 px-4 py-2.5 bg-ccm-dark border border-white/10 rounded-xl text-ccm-silver hover:text-white hover:border-ccm-accent transition-all cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          <span className="text-sm">Subir imagen</span>
                        </label>
                        {imagenUrl && imagenUrl.startsWith('data:') && (
                          <div className="flex items-center gap-2">
                            <img src={imagenUrl} alt="Preview" className="w-10 h-10 object-cover rounded-lg bg-ccm-dark" />
                            <span className="text-xs text-green-400">✓ Cargada</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ccm-silver mb-2">Categoría</label>
                    <select
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-ccm-dark border border-white/10 text-white focus:outline-none focus:border-ccm-accent transition-all"
                    >
                      {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setDestacada(!destacada)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      destacada
                        ? 'bg-ccm-accent/20 text-ccm-accent'
                        : 'bg-ccm-dark text-ccm-silver hover:text-white'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${destacada ? 'fill-current' : ''}`} />
                    {destacada ? 'Destacada' : 'Marcar como destacada'}
                  </button>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-sm text-ccm-silver hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-ccm-accent text-ccm-black rounded-lg font-medium text-sm hover:bg-ccm-accent-light hover:shadow-glow transition-all"
                  >
                    <Save className="w-4 h-4" />
                    {editando ? 'Guardar Cambios' : 'Publicar'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de noticias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {noticias.map((noticia, idx) => (
            <motion.div
              key={noticia.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card rounded-xl overflow-hidden group"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={noticia.imagenUrl}
                  alt={noticia.titulo}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ccm-black via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-ccm-black/60 text-white backdrop-blur-sm">
                    <Tag className="w-3 h-3 inline mr-1" />
                    {noticia.categoria}
                  </span>
                  {noticia.destacada && (
                    <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-ccm-accent/80 text-ccm-black">
                      <Star className="w-3 h-3 inline mr-1" />
                      Destacada
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-bold text-white mb-1 line-clamp-2">{noticia.titulo}</h4>
                <p className="text-xs text-ccm-silver line-clamp-2 mb-3">{noticia.subtitulo}</p>
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
                  <span className="text-[10px] text-ccm-silver">
                    {new Date(noticia.fecha).toLocaleDateString('es-CO')}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(noticia)}
                      className="p-1.5 text-ccm-accent hover:bg-ccm-accent/10 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    {confirmDelete === noticia.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { eliminarNoticia(noticia.id); setConfirmDelete(null); }}
                          className="px-2 py-1 text-[10px] text-red-400 bg-red-500/10 rounded"
                        >
                          Sí
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="px-2 py-1 text-[10px] text-ccm-silver bg-ccm-dark rounded"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(noticia.id)}
                        className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
