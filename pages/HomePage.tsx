import React from 'react';
import MetaTags from '../components/SEO/MetaTags';
import StructuredData, { generateOrganizationSchema, generateWebSiteSchema } from '../components/SEO/StructuredData';
import Hero from '../components/Hero';
import Problems from '../components/Problems';
import Solutions from '../components/Solutions';
import CaseStudy from '../components/CaseStudy';
import Process from '../components/Process';
import WhyUs from '../components/WhyUs';
import FAQ from '../components/FAQ';
import LatestArticles from '../components/LatestArticles';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import BackgroundStars from '../components/BackgroundStars';

// 1. IMPORTAR EL COMPONENTE LOGO
import Logo from '../components/Logo'; 

const HomePage: React.FC = () => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const siteName = 'Teddy Automations';
  const siteDescription = 'Soluciones de automatización y digitalización para comercios, pymes, servicios y alojamientos que buscan crecer sin tareas manuales.';

  const organizationSchema = generateOrganizationSchema(siteName, siteUrl);
  const websiteSchema = generateWebSiteSchema(siteName, siteUrl);

  return (
    <div className="min-h-screen bg-transparent selection:bg-orange-500/30">
      <BackgroundStars />
      
      <MetaTags
        title={`${siteName} | Escalá tu negocio online`}
        description={siteDescription}
        url={siteUrl}
      />
      <StructuredData data={organizationSchema} />
      <StructuredData data={websiteSchema} />

      <div className="relative z-10 w-full">
        
        {/* --- INICIO ZONA DE PRUEBA DE LOGOS --- */}
        <div className="pt-24 pb-10 flex flex-col items-center justify-center gap-10 border-b border-white/10 bg-black/40 backdrop-blur-sm">
          <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">
            Prueba de Diseño de Marca
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            {/* Opción 1: The Core */}
            <div className="flex flex-col items-center gap-4">
               <div className="p-4 border border-zinc-800 rounded-xl bg-zinc-900/50">
                 <Logo variant={1} text="Teddy Automations" className="w-10 h-10" />
               </div>
               <span className="text-zinc-500 text-xs">Opción 1</span>
            </div>

            {/* Opción 2: The Flow */}
            <div className="flex flex-col items-center gap-4">
               <div className="p-4 border border-zinc-800 rounded-xl bg-zinc-900/50">
                 <Logo variant={2} text="Teddy Automations" className="w-10 h-10" />
               </div>
               <span className="text-zinc-500 text-xs">Opción 2</span>
            </div>

            {/* Opción 3: The Spark */}
            <div className="flex flex-col items-center gap-4">
               <div className="p-4 border border-zinc-800 rounded-xl bg-zinc-900/50">
                 <Logo variant={3} text="Teddy Automations" className="w-10 h-10" />
               </div>
               <span className="text-zinc-500 text-xs">Opción 3</span>
            </div>
          </div>
        </div>
        {/* --- FIN ZONA DE PRUEBA DE LOGOS --- */}

        <Hero />
        <Problems />
        <Solutions />
        <CaseStudy />
        <Process />
        <WhyUs />
        <LatestArticles />
        <FAQ />
        <Footer />
      </div>
      <FloatingWhatsApp />
    </div>
  );
};

export default HomePage;