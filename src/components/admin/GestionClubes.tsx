import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save, Users, ImageIcon, Upload } from 'lucide-react';
import type { Club } from '@/types';
import { convertirImagenABase64 } from '@/hooks/useLigaCCM';

interface GestionClubesProps {
  clubes: Club[];
  agregarClub: (nombre: string, logoUrl: string) => void;
  editarClub: (id: string, nombre: string, logoUrl: string) => void;
  eliminarClub: (id: string) => void;
}

export default function GestionClubes({ clubes, agregarClub, editarClub, eliminarClub }: GestionClubesProps) {
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertirImagenABase64(file);
        setLogoUrl(base64);
      } catch (error) {
        console.error('Error al convertir imagen:', error);
      }
    }
  };

  const resetForm = () => {
    setNombre('');
    setLogoUrl('');
    setEditando(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    if (editando) {
      editarClub(editando, nombre.trim(), logoUrl.trim());
    } else {
      agregarClub(nombre.trim(), logoUrl.trim());
    }
    resetForm();
  };

  const startEdit = (club: Club) => {
    setNombre(club.nombre);
    setLogoUrl(club.logoUrl);
    setEditando(club.id);
    setShowForm(true);
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
            <Users className="w-6 h-6 text-ccm-accent" />
            Gestión de Clubes
          </h1>
          <p className="text-ccm-silver text-sm">{clubes.length} clubes registrados</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-ccm-accent text-ccm-black rounded-lg font-medium text-sm hover:bg-ccm-accent-light hover:shadow-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          Agregar Club
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
                  {editando ? 'Editar Club' : 'Nuevo Club'}
                </h3>
                <button onClick={resetForm} className="text-ccm-silver hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ccm-silver mb-2">Nombre del Club *</label>
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ej: Atlético Nacional"
                      className="w-full px-4 py-3 rounded-xl bg-ccm-dark border border-white/10 text-white placeholder:text-ccm-silver/50 focus:outline-none focus:border-ccm-accent focus:ring-1 focus:ring-ccm-accent/30 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ccm-silver mb-2">
                      Logo del Club <span className="text-xs text-ccm-silver/50">(URL o seleccionar archivo)</span>
                    </label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={logoUrl}
                          onChange={(e) => setLogoUrl(e.target.value)}
                          placeholder="Pega una URL de imagen..."
                          className="flex-1 px-4 py-3 rounded-xl bg-ccm-dark border border-white/10 text-white placeholder:text-ccm-silver/50 focus:outline-none focus:border-ccm-accent focus:ring-1 focus:ring-ccm-accent/30 transition-all"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*,.png,.jpg,.jpeg,.gif,.webp,.svg"
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="flex items-center gap-2 px-4 py-2.5 bg-ccm-dark border border-white/10 rounded-xl text-ccm-silver hover:text-white hover:border-ccm-accent transition-all cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          <span className="text-sm">Seleccionar desde PC</span>
                        </label>
                        {logoUrl && logoUrl.startsWith('data:') && (
                          <div className="flex items-center gap-2">
                            <img src={logoUrl} alt="Preview" className="w-10 h-10 object-contain rounded-lg bg-ccm-dark" />
                            <span className="text-xs text-green-400">✓ Cargado</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
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
                    className="flex items-center gap-2 px-6 py-2 bg-ccm-accent text-ccm-black rounded-lg font-medium text-sm hover:bg-ccm-accent-light hover:shadow-glow transition-all"
                  >
                    <Save className="w-4 h-4" />
                    {editando ? 'Guardar Cambios' : 'Crear Club'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de clubes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {clubes.map((club, idx) => (
            <motion.div
              key={club.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card rounded-xl p-5 group hover-lift"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-ccm-dark flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {club.logoUrl ? (
                    <img src={club.logoUrl} alt={club.nombre} className="w-full h-full object-contain p-1" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-ccm-silver" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate">{club.nombre}</h4>
                  <p className="text-xs text-ccm-silver truncate">{club.logoUrl || 'Sin logo'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.05]">
                <button
                  onClick={() => startEdit(club)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium text-ccm-accent bg-ccm-accent/10 rounded-lg hover:bg-ccm-accent/20 transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                  Editar
                </button>
                {confirmDelete === club.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { eliminarClub(club.id); setConfirmDelete(null); }}
                      className="px-3 py-2 text-xs font-medium text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      Sí
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="px-3 py-2 text-xs font-medium text-ccm-silver bg-ccm-dark rounded-lg hover:bg-ccm-gray transition-colors"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(club.id)}
                    className="flex items-center justify-center gap-1 py-2 px-3 text-xs font-medium text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
