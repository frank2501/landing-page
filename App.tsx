
import React from 'react';
import Hero from './components/Hero';
import Problems from './components/Problems';
import Solutions from './components/Solutions';
import CaseStudy from './components/CaseStudy';
import Process from './components/Process';
import WhyUs from './components/WhyUs';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import BackgroundStars from './components/BackgroundStars';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-transparent selection:bg-orange-500/30">
      <BackgroundStars />
      <div className="relative z-10 w-full">
        <Hero />
        <Problems />
        <Solutions />
        <CaseStudy />
        <Process />
        <WhyUs />
        <FAQ />
        <Footer />
      </div>
      <FloatingWhatsApp />
    </div>
  );
};

export default App;
