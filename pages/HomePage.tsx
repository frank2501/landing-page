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

const HomePage: React.FC = () => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const siteName = 'ArtechIA';
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