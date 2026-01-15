
import React from 'react';

const WhyUs: React.FC = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 tracking-tight">
          Por qué confiar en nosotros
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5">
            <h3 className="text-xl font-bold mb-4 text-orange-400">Resultados reales</h3>
            <p className="text-gray-400 leading-relaxed">
              No vendemos humo ni promesas exageradas. Te mostramos cómo los sistemas ahorran tiempo y dinero desde el primer día.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5">
            <h3 className="text-xl font-bold mb-4 text-orange-400">Sin tecnicismos</h3>
            <p className="text-gray-400 leading-relaxed">
              Hablamos tu mismo idioma. No necesitás saber de programación ni de servidores para que tu tienda funcione sola.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5">
            <h3 className="text-xl font-bold mb-4 text-orange-400">Soporte local</h3>
            <p className="text-gray-400 leading-relaxed">
              Estamos en Argentina, conocemos el mercado y estamos a un mensaje de WhatsApp de distancia ante cualquier duda.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5">
            <h3 className="text-xl font-bold mb-4 text-orange-400">Escalabilidad</h3>
            <p className="text-gray-400 leading-relaxed">
              Nuestras soluciones crecen con vos. Si mañana tenés 10 proveedores nuevos, el sistema lo maneja sin problemas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
