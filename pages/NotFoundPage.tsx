import React from 'react';
import { Link } from 'react-router-dom';
import MetaTags from '../components/SEO/MetaTags';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import BackgroundStars from '../components/BackgroundStars';

const NotFoundPage: React.FC = () => {
  const siteName = 'Teddy Automations';

  return (
    <div className="min-h-screen bg-transparent selection:bg-orange-500/30">
      <BackgroundStars />
      
      <MetaTags
        title={`404 - Página no encontrada | ${siteName}`}
        description="La página que buscas no existe."
      />

      <div className="relative z-10 w-full flex items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-2xl">
          <h1 className="text-6xl md:text-9xl font-bold mb-4">404</h1>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Página no encontrada</h2>
          <p className="text-lg md:text-xl text-gray-400 mb-8">
            La página que buscas no existe o ha sido movida.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="px-8 py-3 bg-white text-black font-bold rounded-2xl hover:bg-orange-500 hover:text-white transition-all duration-300"
            >
              Ir al inicio
            </Link>
            <Link
              to="/blog"
              className="px-8 py-3 bg-zinc-900/80 backdrop-blur-sm border border-white/10 text-white font-medium rounded-2xl hover:border-orange-500/50 transition-all"
            >
              Ver blog
            </Link>
          </div>
        </div>
      </div>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default NotFoundPage;
