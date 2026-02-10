import React from 'react';
import DashboardMockup from './DashboardMockup';

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
    <section className="relative pt-32 pb-12 md:pt-40 md:pb-20 overflow-hidden px-6 bg-transparent">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] md:h-[600px] glow-horizon opacity-40 pointer-events-none" />
      
      <div className="relative max-w-6xl mx-auto text-center z-20">
        <div className="inline-flex items-center px-4 py-1.5 mb-6 md:mb-8 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-400 text-[10px] md:sm font-medium animate-pulse">
          Soluciones digitales integrales
        </div>
        
        <h1 className="text-4xl md:text-8xl font-bold mb-4 md:mb-6 tracking-tight leading-[1.1]">
          Desarrollo Web y <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-orange-400 via-orange-200 to-orange-500 bg-clip-text text-transparent">
            Automatización
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-base md:text-xl text-gray-400 mb-8 md:mb-10 leading-relaxed px-2">
          Sitios web modernos, sistemas de gestión a medida y automatización de procesos. Transformamos tu negocio para que crezca sin límites.
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

        <DashboardMockup />
      </div>
    </section>
  );
};

export default Hero;