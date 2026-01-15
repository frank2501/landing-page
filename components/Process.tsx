
import React from 'react';

const Process: React.FC = () => {
  const steps = [
    {
      title: "Charla inicial",
      desc: "Nos contás cómo trabajás hoy y cuáles son tus mayores dolores de cabeza."
    },
    {
      title: "Plan de acción",
      desc: "Diseñamos la solución para automatizar tus tareas sin que tengas que aprender nada técnico."
    },
    {
      title: "Puesta en marcha",
      desc: "Conectamos todo y lo dejamos funcionando. Vos vendés mientras nosotros hacemos la magia."
    }
  ];

  return (
    <section className="py-16 md:py-24 px-6 border-y border-white/5 bg-transparent relative z-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 md:mb-16 text-center tracking-tight">
          Cómo empezamos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group pt-6 md:pt-8">
              <div className="text-6xl md:text-8xl font-black text-white/30 absolute -top-6 md:-top-8 -left-1 select-none font-mono tracking-tighter">
                0{idx + 1}
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 relative z-10 text-white group-hover:text-orange-400 transition-colors">
                {step.title}
              </h3>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed relative z-10">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
