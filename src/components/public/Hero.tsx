import { motion } from 'framer-motion';
import { ChevronDown, Trophy, Users, Calendar } from 'lucide-react';

export default function Hero({ totalClubes, totalPartidos }: { totalClubes: number; totalPartidos: number }) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-ccm-darker via-ccm-black to-ccm-black" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ccm-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-ccm-accent/3 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/[0.02] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/[0.03] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <img
            src="/logo-liga-ccm.png"
            alt="Liga CCM"
            className="h-32 w-auto mx-auto mb-6 drop-shadow-2xl"
          />
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-display text-white tracking-tight mb-4">
            LIGA <span className="text-gradient">CCM</span>
          </h1>
          <p className="text-xl sm:text-2xl text-ccm-silver font-light max-w-2xl mx-auto">
            La élite del fútbol en <span className="text-ccm-accent font-medium">Roblox</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-6 mb-12"
        >
          <div className="glass-card rounded-xl px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-ccm-accent/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-ccm-accent" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-white">{totalClubes}</div>
              <div className="text-xs text-ccm-silver uppercase tracking-wider">Clubes</div>
            </div>
          </div>
          <div className="glass-card rounded-xl px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-ccm-accent/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-ccm-accent" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-white">{totalPartidos}</div>
              <div className="text-xs text-ccm-silver uppercase tracking-wider">Partidos</div>
            </div>
          </div>
          <div className="glass-card rounded-xl px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-ccm-accent/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-ccm-accent" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-white">2026</div>
              <div className="text-xs text-ccm-silver uppercase tracking-wider">Temporada</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center"
        >
          <a
            href="#ticker"
            className="flex flex-col items-center text-ccm-silver hover:text-ccm-accent transition-colors group"
          >
            <span className="text-sm mb-2">Explora</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
