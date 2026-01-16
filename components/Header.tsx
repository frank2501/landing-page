import React from 'react';
import Logo from './Logo';
import { useLocation, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const handleLogoClick = () => {
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const scrollToSection = (id: string) => {
    if (isHomePage) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/20 backdrop-blur-lg border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Logo onClick={handleLogoClick} />
        
        {/* Navigation - Only show section links if helpful generally, or handle redirect */}
        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => navigate('/implementaciones')} 
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Implementaciones
          </button>
          <button 
            onClick={() => scrollToSection('solutions')} 
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Soluciones
          </button>
          <a 
            href="https://wa.me/5491137758970" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-5 py-2 text-xs font-bold text-black bg-white rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg shadow-white/5"
          >
            Empezar Ahora
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Header;
