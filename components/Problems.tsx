
import React from 'react';

const Problems: React.FC = () => {
  const pains = [
    {
      title: "Invisible en internet",
      desc: "Tus clientes te buscan en Google y no te encuentran. Si no tenés web, perdés ventas todos los días."
    },
    {
      title: "Caos de reservas manuales",
      desc: "Anotar turnos en papel o WhatsApp genera confusiones, olvidos y huecos en tu agenda."
    },
    {
      title: "Información desactualizada",
      desc: "Tus precios cambian o tu stock varía, y seguís mostrando datos viejos en redes sociales."
    },
    {
      title: "Dependencia operativa",
      desc: "Sentís que si no estás vos encima de cada detalle, el negocio no funciona. Te convertís en esclavo de tu emprendimiento."
    }
  ];

  return (
    <section className="py-16 md:py-24 px-6 border-t border-white/5 bg-transparent relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-10 md:mb-16 tracking-tight">
          Gestionar tu comercio <br />
          <span className="text-gray-500">no debería ser una carga constante</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 text-left">
          {pains.map((pain, idx) => (
            <div key={idx} className="group p-6 md:p-8 rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-md hover:bg-zinc-900/60 transition-all duration-300">
              <div className="text-orange-500 mb-2 md:mb-4 font-mono text-[10px] md:text-xs tracking-widest uppercase">[ PROBLEMA_{idx + 1} ]</div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-white">{pain.title}</h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">{pain.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problems;
