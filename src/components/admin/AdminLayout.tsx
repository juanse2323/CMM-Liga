import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, LayoutDashboard, Users, Calendar, Trophy,
  Newspaper, LogOut, Menu, X, ChevronRight, Crown
} from 'lucide-react';
import type { AuthState } from '@/types';

interface AdminLayoutProps {
  auth: AuthState;
  logout: () => void;
  children: ReactNode;
}

export default function AdminLayout({ auth, logout, children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/clubes', label: 'Clubes', icon: Users },
    { path: '/admin/partidos', label: 'Partidos', icon: Calendar },
    { path: '/admin/resultados', label: 'Resultados', icon: Trophy },
    { path: '/admin/tabla', label: 'Tabla', icon: Trophy },
    { path: '/admin/noticias', label: 'Noticias', icon: Newspaper },
    { path: '/admin/admins', label: 'Admins', icon: Crown },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-ccm-black flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-ccm-darker border-r border-white/[0.05] transform transition-transform duration-300 lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-white/[0.05]">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <img src="/logo-liga-ccm.png" alt="Liga CCM" className="h-8 w-auto" />
              <div>
                <span className="text-sm font-bold font-display text-white">
                  LIGA <span className="text-gradient">CCM</span>
                </span>
                <p className="text-[10px] text-ccm-silver">Admin</p>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-ccm-silver">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User */}
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-ccm-dark">
              <div className="w-8 h-8 rounded-full bg-ccm-accent/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-ccm-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{auth.username}</p>
                <p className="text-[10px] text-ccm-silver">Administrador</p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 px-4 py-2 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-ccm-accent/10 text-ccm-accent border-l-2 border-ccm-accent'
                      : 'text-ccm-silver hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-ccm-accent' : ''}`} />
                  {item.label}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/[0.05]">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/[0.05] bg-ccm-black/50 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-ccm-silver hover:text-white hover:bg-white/5 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <Link
              to="/"
              className="text-sm text-ccm-silver hover:text-ccm-accent transition-colors"
            >
              Ver sitio público
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
