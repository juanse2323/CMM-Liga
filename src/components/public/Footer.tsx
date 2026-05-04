import { Trophy, Github, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-ccm-black border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo-liga-ccm.png" alt="Liga CCM" className="h-10 w-auto" />
              <div>
                <span className="text-lg font-bold font-display text-white">
                  LIGA <span className="text-gradient">CCM</span>
                </span>
              </div>
            </div>
            <p className="text-ccm-silver text-sm leading-relaxed">
              La competencia de fútbol más prestigiosa de Roblox. Donde la pasión se encuentra con la tecnología.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-ccm-accent" />
              Enlaces
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#hero" className="text-ccm-silver hover:text-ccm-accent transition-colors">Inicio</a></li>
              <li><a href="#ticker" className="text-ccm-silver hover:text-ccm-accent transition-colors">Resultados</a></li>
              <li><a href="#noticias" className="text-ccm-silver hover:text-ccm-accent transition-colors">Noticias</a></li>
              <li><a href="#tabla" className="text-ccm-silver hover:text-ccm-accent transition-colors">Tabla</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Síguenos</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-ccm-dark flex items-center justify-center text-ccm-silver hover:text-ccm-accent hover:bg-ccm-gray transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-ccm-dark flex items-center justify-center text-ccm-silver hover:text-ccm-accent hover:bg-ccm-gray transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-ccm-dark flex items-center justify-center text-ccm-silver hover:text-ccm-accent hover:bg-ccm-gray transition-all">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.05] text-center">
          <p className="text-ccm-silver text-xs">
            &copy; 2026 Liga CCM. Todos los derechos reservados. Fútbol Roblox.
          </p>
          <p className="text-white text-xs mt-2 font-medium">
            Creado por <span className="text-ccm-accent">Juansec</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
