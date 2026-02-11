import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { useLocation, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  // Toggle body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen]);

  // Close menu on navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogoClick = () => {
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
    setIsMenuOpen(false);
  };

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
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
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300">
      {/* Glass Background for Navbar */}
      <div className={`absolute inset-0 bg-black/10 backdrop-blur-md border-b border-white/5 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
      
      <div className="relative max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="z-[10000]">
          <Logo onClick={handleLogoClick} />
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => navigate('/implementaciones')} 
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Implementaciones
          </button>
          <button 
            onClick={() => navigate('/demos')} 
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Demos
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
            className="px-5 py-2 text-sm font-bold text-black bg-white rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg shadow-white/5"
          >
            Empezar Ahora
          </a>
        </div>

      {/* Mobile Menu Button - Z-index adjusted to stay on top */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-white z-[10000] relative group"
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <div className="w-8 h-8 flex flex-col justify-center gap-1.5">
            <span className={`block w-full h-0.5 bg-white transition-all duration-300 ease-out ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-2/3 h-0.5 bg-white transition-all duration-300 ease-out ml-auto group-hover:w-full ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-full h-0.5 bg-white transition-all duration-300 ease-out ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu - Minimalist Design */}
      <div 
        className={`fixed inset-0 z-[9999] md:hidden transition-all duration-500 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Simple Dark Backdrop */}
        <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-xl" />
        
        {/* Menu Content */}
        <div className="relative h-full flex flex-col justify-center px-8">
          
          {/* Navigation Links */}
          <div className="flex flex-col gap-8">
            <button 
              onClick={() => navigate('/implementaciones')} 
              className={`text-left transform transition-all duration-500 delay-100 ${
                isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            >
              <span className="text-3xl font-medium text-white hover:text-orange-500 transition-colors">
                Implementaciones
              </span>
            </button>

            <button 
              onClick={() => navigate('/demos')} 
              className={`text-left transform transition-all duration-500 delay-125 ${
                isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            >
              <span className="text-3xl font-medium text-white hover:text-orange-500 transition-colors">
                Demos
              </span>
            </button>

            <button 
              onClick={() => scrollToSection('solutions')} 
              className={`text-left transform transition-all duration-500 delay-150 ${
                isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            >
              <span className="text-3xl font-medium text-white hover:text-orange-500 transition-colors">
                Soluciones
              </span>
            </button>
            
            <a 
              href="https://wa.me/5491137758970" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`inline-block px-5 py-3 text-sm font-bold text-black bg-white rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg shadow-white/5 w-fit transform transition-all duration-500 delay-200 ${
                isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            >
              Empezar Ahora
            </a>
          </div>

          {/* Socials / Footer */}
          <div className={`absolute bottom-12 left-8 right-8 flex justify-between items-center transform transition-all duration-500 delay-300 ${
             isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}>
             <span className="text-sm text-zinc-500 font-medium">© 2026 ArtechIA</span>
             <div className="flex gap-4">
                <a href="https://instagram.com/artech.ia" className="hidden sm:block text-zinc-500 hover:text-white transition-colors">Instagram</a>
                <a href="#" className="hidden sm:block text-zinc-500 hover:text-white transition-colors">LinkedIn</a>
             </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
