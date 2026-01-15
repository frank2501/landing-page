
import React, { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="border-b border-white/10 py-6 md:py-8 cursor-pointer group"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-start gap-4">
        <div className={`mt-1.5 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
          <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div className="flex-grow">
          <h3 className="text-lg md:text-2xl font-bold text-gray-200 group-hover:text-white transition-colors">
            {question}
          </h3>
          <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] mt-3 md:mt-4 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              <p className="text-base md:text-xl text-gray-500 leading-relaxed">
                {answer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "¿Mi negocio es muy chico para esto?",
      answer: "Al contrario. Los negocios chicos son los que más necesitan automatizar tareas para poder enfocarse en crecer."
    },
    {
      question: "¿Sirve para servicios o alojamientos?",
      answer: "Totalmente. Automatizamos desde toma de turnos y reservas hasta envío de presupuestos o gestión de precios."
    },
    {
      question: "¿Qué pasa si ya uso otras herramientas?",
      answer: "Nosotros conectamos lo que ya tenés para que funcione solo. Nos adaptamos a tu forma de trabajar."
    },
    {
      question: "¿Es muy costoso implementar esto?",
      answer: "Diseñamos soluciones escalables. Podés empezar con algo simple y económico e ir sumando más luego."
    }
  ];

  return (
    <section className="py-16 md:py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-8xl font-bold mb-4">Preguntas</h2>
        <div className="flex items-center gap-2 text-gray-500 mb-10 md:mb-16">
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
          </svg>
          <span className="text-sm md:text-lg">Actualizado recientemente</span>
        </div>
        
        <div className="border-t border-white/10">
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
