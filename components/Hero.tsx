import React from 'react';

const Hero: React.FC = () => {
  const handleWhatsApp = () => {
    window.open('https://wa.me/5491137758970?text=Hola%2C%20tengo%20un%20negocio%20y%20quiero%20saber%20c%C3%B3mo%20automatizar%20tareas%20para%20ahorrar%20tiempo%20y%20evitar%20errores.', '_blank');
  };

  const scrollToSolutions = () => {
    const element = document.getElementById('solutions');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-16 pb-12 md:pt-32 md:pb-20 overflow-hidden px-6 bg-transparent">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] md:h-[600px] glow-horizon opacity-40 pointer-events-none" />
      
      <div className="relative max-w-6xl mx-auto text-center z-20">
        <div className="inline-flex items-center px-4 py-1.5 mb-6 md:mb-8 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-400 text-[10px] md:sm font-medium animate-pulse">
          Sistemas inteligentes para tu negocio
        </div>
        
        <h1 className="text-4xl md:text-8xl font-bold mb-4 md:mb-6 tracking-tight leading-[1.1]">
          Escalá tu negocio <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-orange-400 via-orange-200 to-orange-500 bg-clip-text text-transparent">
            sin tareas manuales
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-base md:text-xl text-gray-400 mb-8 md:mb-10 leading-relaxed px-2">
          Automatizá tus procesos, precios y atención. Dejá de pasar horas frente a la computadora y gestioná tu negocio de forma profesional.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-4 mb-12 md:mb-16 max-w-sm mx-auto sm:max-w-none">
          <button 
            onClick={handleWhatsApp}
            className="w-full sm:w-auto px-8 py-3 md:px-10 md:py-4 bg-white text-black font-bold rounded-2xl hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-white/5 text-sm md:text-lg"
          >
            Consultar WhatsApp
          </button>
          <button 
            onClick={scrollToSolutions}
            className="w-full sm:w-auto px-8 py-3 md:px-10 md:py-4 bg-zinc-900/80 backdrop-blur-sm border border-white/10 text-white font-medium rounded-2xl hover:border-orange-500/50 transition-all text-sm md:text-lg"
          >
            Ver soluciones
          </button>
        </div>

        {/* Dashboard Mockup - Compacted for mobile */}
        <div className="relative max-w-5xl mx-auto">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 to-transparent rounded-2xl blur opacity-30" />
          <div className="relative bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Mockup Header */}
            <div className="flex items-center gap-2 px-4 py-2 md:py-3 border-b border-white/5 bg-white/5">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
              </div>
              <div className="text-[8px] md:text-[10px] text-gray-500 ml-4 font-mono uppercase">
                CONTROL_PANEL
              </div>
            </div>
            {/* Mockup Content - Simplified grid for mobile */}
            <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 text-left">
              {/* Item 1 */}
              <div className="p-4 md:p-6 rounded-xl bg-zinc-900/50 border border-white/5 transition-all duration-300 transform hover:-translate-y-1 hover:bg-zinc-800/80 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10 cursor-default">
                <div className="text-gray-500 text-[9px] md:text-xs mb-1 uppercase tracking-wider">Estado</div>
                <div className="text-lg md:text-2xl font-bold text-white tracking-tight">Activa 24/7</div>
                <div className="mt-3 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                </div>
              </div>

              {/* Item 2 */}
              <div className="hidden md:block p-4 md:p-6 rounded-xl bg-zinc-900/50 border border-white/5 transition-all duration-300 transform hover:-translate-y-1 hover:bg-zinc-800/80 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10 cursor-default">
                <div className="text-gray-500 text-[9px] md:text-xs mb-1 uppercase tracking-wider">Ahorro Mensual</div>
                <div className="text-lg md:text-2xl font-bold text-white tracking-tight">45+ Horas</div>
                <div className="text-green-400 text-[9px] md:text-xs mt-2 font-mono uppercase tracking-tighter">+ 100% Eficiencia</div>
              </div>

              {/* Item 3 */}
              <div className="p-4 md:p-6 rounded-xl bg-zinc-900/50 border border-white/5 transition-all duration-300 transform hover:-translate-y-1 hover:bg-zinc-800/80 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10 cursor-default">
                <div className="text-gray-500 text-[9px] md:text-xs mb-1 uppercase tracking-wider">Operaciones</div>
                <div className="text-lg md:text-2xl font-bold text-white tracking-tight">0 Errores</div>
                <div className="text-green-400 text-[9px] md:text-xs mt-2 font-mono uppercase tracking-tighter">Ejecución segura</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;