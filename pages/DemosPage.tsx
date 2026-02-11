import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundStars from '../components/BackgroundStars';
import Footer from '../components/Footer';

const industries = [
  {
    id: 'gimnasios',
    title: 'Gimnasios',
    subtitle: 'Landing Page + Sistema de Gestión',
    description: 'Planes mensuales, pagos online, manejo de socios y automatizaciones para que tu gym funcione solo.',
    color: 'orange',
    gradient: 'from-orange-500 to-red-500',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12h1m16 0h1m-9-9v1m0 16v1m-6.364-1.636l.707-.707m12.02-12.02l.707-.707M5.636 5.636l.707.707m12.02 12.02l.707.707" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 12h4m4 0h4M8 8v8m8-8v8" />
      </svg>
    ),
    features: [
      'Planes mensuales con pago online',
      'Gestión y base de socios',
      'Avisos automáticos de renovación',
      'Promociones y descuentos',
      'Dashboard de ingresos',
    ],
  },
  {
    id: 'hoteles',
    title: 'Hoteles & Alojamientos',
    subtitle: 'Web + Gestión Hotelera Integral',
    description: 'Sistema de reservas, calendario de disponibilidad, automatizaciones de comunicación y gestión de huéspedes.',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    features: [
      'Buscador con calendario de disponibilidad',
      'Emails automáticos pre y post estadía',
      'Conexión multiplataforma (Booking, Airbnb)',
      'Pagos integrados y señas',
      'Cupones, promociones y email marketing',
    ],
  },
  {
    id: 'consultorios',
    title: 'Consultorios Médicos',
    subtitle: 'Web + Turnos Online + Gestión',
    description: 'Sistema de turnos, gestión de pacientes, recordatorios automáticos y ficha digital.',
    color: 'green',
    gradient: 'from-emerald-500 to-teal-500',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    features: [
      'Turnos online con calendario',
      'Gestión de pacientes e historial',
      'Recordatorios automáticos (WhatsApp/Email)',
      'Ficha del paciente digital',
      'Reportes de turnos y asistencia',
    ],
  },
];

const DemosPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-transparent selection:bg-orange-500/30">
      <BackgroundStars />
      <div className="relative z-10 w-full">
        {/* Hero */}
        <section className="relative pt-32 pb-12 md:pt-40 md:pb-20 px-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] glow-horizon opacity-30 pointer-events-none" />
          <div className="relative max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-400 text-[10px] md:text-sm font-medium">
              Explorá soluciones por rubro
            </div>
            <h1 className="text-4xl md:text-7xl font-bold mb-4 md:mb-6 tracking-tight leading-[1.1]">
              Mirá lo que podemos{' '}
              <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-orange-400 via-orange-200 to-orange-500 bg-clip-text text-transparent">
                hacer por tu negocio
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-base md:text-xl text-gray-400 mb-4 leading-relaxed px-2">
              Recorridos visuales de sistemas reales que podemos implementar para tu rubro. Cada demo muestra la landing page, el panel de gestión y las automatizaciones disponibles.
            </p>
          </div>
        </section>

        {/* Industry Cards */}
        <section className="py-8 md:py-16 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {industries.map((industry) => (
              <button
                key={industry.id}
                onClick={() => navigate(`/demos/${industry.id}`)}
                className="group relative text-left p-6 md:p-8 rounded-2xl bg-zinc-950/40 backdrop-blur-md border border-white/5 hover:border-orange-500/40 transition-all duration-500 overflow-hidden"
              >
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${industry.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-14 h-14 mb-6 rounded-xl bg-${industry.color}-500/10 flex items-center justify-center text-${industry.color}-400 border border-${industry.color}-500/20 group-hover:scale-110 transition-transform duration-300`}>
                    {industry.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">
                    {industry.title}
                  </h3>
                  <p className="text-xs text-orange-400/70 font-medium mb-4">{industry.subtitle}</p>
                  <p className="text-sm text-gray-400 leading-relaxed mb-6">{industry.description}</p>

                  {/* Features list */}
                  <ul className="space-y-2 mb-8">
                    {industry.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                        <div className={`w-1 h-1 rounded-full bg-${industry.color}-500 mt-1.5 shrink-0`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                    Ver Demo
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default DemosPage;
