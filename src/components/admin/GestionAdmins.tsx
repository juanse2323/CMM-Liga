import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Plus, Trash2, X, Save, Crown, User } from 'lucide-react';

interface GestionAdminsProps {
  auth: { username: string; role: 'supreme' | 'admin' };
  agregarAdmin: (username: string, password: string, role: 'supreme' | 'admin') => boolean;
  eliminarAdmin: (username: string) => boolean;
  getAdmins: () => { username: string; role: 'supreme' | 'admin' }[];
}

export default function GestionAdmins({ auth, agregarAdmin, eliminarAdmin, getAdmins }: GestionAdminsProps) {
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'supreme' | 'admin'>('admin');
  const [mensaje, setMensaje] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const admins = getAdmins();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setMensaje({ type: 'error', text: 'Todos los campos son requeridos' });
      setTimeout(() => setMensaje(null), 3000);
      return;
    }
    const success = agregarAdmin(username.trim(), password.trim(), role);
    if (success) {
      setMensaje({ type: 'success', text: `Admin "${username}" agregado correctamente` });
      setShowForm(false);
      setUsername('');
      setPassword('');
      setRole('admin');
    } else {
      setMensaje({ type: 'error', text: 'Error al agregar admin. Puede que ya exista o no tienes permisos.' });
    }
    setTimeout(() => setMensaje(null), 3000);
  };

  const handleDelete = (usernameToDelete: string) => {
    const success = eliminarAdmin(usernameToDelete);
    if (success) {
      setMensaje({ type: 'success', text: `Admin "${usernameToDelete}" eliminado` });
    } else {
      setMensaje({ type: 'error', text: 'No puedes eliminar este admin o no tienes permisos' });
    }
    setTimeout(() => setMensaje(null), 3000);
  };

  if (auth.role !== 'supreme') {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 text-ccm-silver/30 mx-auto mb-4" />
        <p className="text-ccm-silver">No tienes permisos para gestionar admins</p>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold font-display text-white mb-1 flex items-center gap-2">
            <Shield className="w-6 h-6 text-ccm-accent" />
            Gestión de Admins
          </h1>
          <p className="text-ccm-silver text-sm">{admins.length} admins registrados</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-ccm-accent text-ccm-black rounded-lg font-medium text-sm hover:bg-ccm-accent-light hover:shadow-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          Agregar Admin
        </button>
      </motion.div>

      {mensaje && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${
            mensaje.type === 'success'
              ? 'bg-green-500/10 border border-green-500/20 text-green-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}
        >
          {mensaje.text}
        </motion.div>
      )}

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 overflow-hidden"
        >
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Nuevo Admin</h3>
              <button onClick={() => setShowForm(false)} className="text-ccm-silver hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ccm-silver mb-2">Usuario</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nombre de usuario"
                    className="w-full px-4 py-3 rounded-xl bg-ccm-dark border border-white/10 text-white placeholder:text-ccm-silver/50 focus:outline-none focus:border-ccm-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ccm-silver mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full px-4 py-3 rounded-xl bg-ccm-dark border border-white/10 text-white placeholder:text-ccm-silver/50 focus:outline-none focus:border-ccm-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ccm-silver mb-2">Rol</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'supreme' | 'admin')}
                    className="w-full px-4 py-3 rounded-xl bg-ccm-dark border border-white/10 text-white focus:outline-none focus:border-ccm-accent"
                  >
                    <option value="admin">Admin</option>
                    <option value="supreme">Supreme</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm text-ccm-silver hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-ccm-accent text-ccm-black rounded-lg font-medium text-sm hover:bg-ccm-accent-light"
                >
                  <Save className="w-4 h-4" />
                  Crear Admin
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {/* Lista de admins */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {admins.map((admin) => (
          <motion.div
            key={admin.username}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-xl p-5"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-ccm-dark flex items-center justify-center">
                {admin.role === 'supreme' ? (
                  <Crown className="w-6 h-6 text-yellow-400" />
                ) : (
                  <User className="w-6 h-6 text-ccm-silver" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold">{admin.username}</h4>
                <p className="text-xs text-ccm-silver">
                  {admin.role === 'supreme' ? '👑 Administrador Supremo' : '👤 Administrador'}
                </p>
              </div>
            </div>
            {admin.username !== 'Juansec' && (
              <button
                onClick={() => handleDelete(admin.username)}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-xs text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Eliminar
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}