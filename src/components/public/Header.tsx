import { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield, Trophy, Table } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Info', href: '#info', icon: Trophy },
    { label: 'Tabla', href: '#tabla', icon: Table },
    { label: 'Partidos', href: '#partidos', icon: Table },
    { label: 'Noticias', href: '#noticias', icon: Table },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <img
              src="/CMM-Liga/logo-liga-ccm.png"
              alt="Liga CCM"
              className="h-8 sm:h-10 w-auto transition-transform duration-300 group-hover:scale-110"
            />
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold font-display text-white tracking-tight">
                LIGA <span className="text-gradient">CCM</span>
              </span>
              <span className="hidden sm:block text-[10px] text-ccm-silver tracking-widest uppercase -mt-1">Fútbol Roblox</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-2 px-4 py-2 text-sm text-ccm-silver hover:text-white rounded-lg transition-all duration-300 hover:bg-white/5"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </a>
            ))}
          </nav>

          {/* Admin link */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/admin"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-ccm-black bg-ccm-accent rounded-lg transition-all duration-300 hover:bg-ccm-accent-light hover:shadow-glow"
            >
              <Shield className="w-4 h-4" />
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-ccm-silver hover:text-white rounded-lg transition-colors"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/5"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-ccm-silver hover:text-white rounded-lg transition-colors hover:bg-white/5"
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </a>
              ))}
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 mt-2 text-ccm-black bg-ccm-accent rounded-lg font-medium"
              >
                <Shield className="w-5 h-5" />
                Panel Admin
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
