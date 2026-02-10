
import React from 'react';

const Solutions: React.FC = () => {
  const services = [
    {
      title: "Desarrollo Web Premium",
      desc: "Sitios institucionales y Landing Pages de alto impacto visual, optimizados para captar clientes."
    },
    {
      title: "Sistemas de Gestión",
      desc: "Plataformas a medida para gestionar turnos, reservas, clientes y bases de datos complejas."
    },
    {
      title: "Tiendas Online",
      desc: "E-commerce completo, integrado con métodos de pago y envíos. Vendé 24/7 sin fronteras."
    },
    {
      title: "Automatización de Stock",
      desc: "Tus listas de precios y productos actualizados automáticamente. Olvidate de la carga manual."
    },
    {
      title: "Integraciones Inteligentes",
      desc: "Conectamos WhatsApp, Google Sheets y tus herramientas favoritas para que trabajen solas."
    },
    {
      title: "Soporte Técnico Evolutivo",
      desc: "No solo mantenemos tu sistema, lo mejoramos constantemente para acompañar tu crecimiento."
    }
  ];

  return (
    <section className="py-16 md:py-24 px-6 bg-transparent relative z-10">
      <div className="max-w-6xl mx-auto">
        <div id="solutions" className="mb-10 md:mb-16 scroll-mt-24">
          <h2 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6 tracking-tight">
            Lo que hacemos por vos
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl">
            Soluciones a medida para que tu negocio funcione de forma inteligente y profesional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {services.map((service, idx) => (
            <div key={idx} className="premium-border p-6 md:p-8 rounded-2xl group hover:border-orange-500/40 transition-all duration-500 bg-zinc-950/20 backdrop-blur-md">
              <div className="w-10 h-10 md:w-12 md:h-12 mb-4 md:mb-6 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/20">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-4 text-white group-hover:text-orange-400 transition-colors">
                {service.title}
              </h3>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solutions;
