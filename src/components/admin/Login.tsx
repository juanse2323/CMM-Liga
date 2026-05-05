import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { LogIn, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';

interface LoginProps {
  login: (username: string, password: string) => boolean;
}

export default function Login({ login }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = login(username, password);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Usuario o contraseña incorrectos');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ccm-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-ccm-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-ccm-accent/3 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-card rounded-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src="/CMM-Liga/logo-liga-ccm.png"
              alt="Liga CCM"
              className="h-20 w-auto mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold font-display text-white mb-1">
              Panel de <span className="text-gradient">Administración</span>
            </h1>
            <p className="text-ccm-silver text-sm">Liga CCM - Fútbol Roblox</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-ccm-silver mb-2">Usuario</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ccm-silver" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-ccm-dark border border-white/10 text-white placeholder:text-ccm-silver/50 focus:outline-none focus:border-ccm-accent focus:ring-1 focus:ring-ccm-accent/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ccm-silver mb-2">Contraseña</label>
              <div className="relative">
                <LogIn className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ccm-silver" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-ccm-dark border border-white/10 text-white placeholder:text-ccm-silver/50 focus:outline-none focus:border-ccm-accent focus:ring-1 focus:ring-ccm-accent/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ccm-silver hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-ccm-accent text-ccm-black font-semibold transition-all hover:bg-ccm-accent-light hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-ccm-black/30 border-t-ccm-black rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-ccm-silver hover:text-ccm-accent transition-colors">
              Volver al inicio
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
