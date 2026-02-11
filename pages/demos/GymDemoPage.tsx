import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

type ViewMode = 'site' | 'admin' | 'live';

const plans = [
  { name: 'Básico', price: '12.000', features: ['Sala de musculación', 'Horario corrido', 'Casillero estándar', 'App de seguimiento'], popular: false },
  { name: 'Premium', price: '18.500', features: ['Todo lo del Básico', 'Clases grupales ilimitadas', 'Acceso a pileta', 'Nutricionista 1x/mes', 'Invitá 1 amigo/mes'], popular: true },
  { name: 'Elite', price: '27.000', features: ['Todo lo del Premium', 'Personal Trainer 2x/sem', 'Spa & sauna', 'Descuento suplementos', 'Todas las sedes'], popular: false },
];

const reviews = [
  { name: 'Martín Gutiérrez', time: 'hace 3 meses', rating: 5, text: 'Excelente gimnasio. Las instalaciones están impecables y los profes te motivan siempre. El mejor gym en el que entrené.', initial: 'M', color: 'bg-blue-600' },
  { name: 'Camila Fernández', time: 'hace 5 meses', rating: 5, text: 'Las clases grupales son increíbles. Se nota que invierten en los equipos. Super recomendable para cualquier nivel.', initial: 'C', color: 'bg-rose-500' },
  { name: 'Lucas Pereyra', time: 'hace 1 año', rating: 4, text: 'Muy buena relación calidad-precio. A veces en horario pico está un poco lleno, pero la onda del equipo compensa todo.', initial: 'L', color: 'bg-amber-600' },
];

const locations = [
  { name: 'PALERMO', address: 'Av. Santa Fe 3200, Palermo, CABA', tag: 'SEDE CENTRAL', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800' },
  { name: 'BELGRANO', address: 'Cabildo 1800, Belgrano, CABA', tag: 'NUEVA', image: 'https://images.unsplash.com/photo-1540497077202-7c8a33801524?auto=format&fit=crop&q=80&w=800' },
  { name: 'CABALLITO', address: 'Av. Rivadavia 5100, Caballito, CABA', tag: 'NUEVA', image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80&w=800' },
  { name: 'QUILMES', address: 'Av. Mitre 600, Quilmes, Buenos Aires', tag: 'PRÓXIMAMENTE', image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&q=80&w=800' },
];

const members = [
  { name: 'Martín López', plan: 'Premium', status: 'Activo', expires: '15/03/2026', initials: 'ML' },
  { name: 'Lucía Rodríguez', plan: 'Elite', status: 'Activo', expires: '22/03/2026', initials: 'LR' },
  { name: 'Carlos Gómez', plan: 'Básico', status: 'Por vencer', expires: '12/02/2026', initials: 'CG' },
  { name: 'Ana Martínez', plan: 'Premium', status: 'Vencido', expires: '01/02/2026', initials: 'AM' },
  { name: 'Diego Fernández', plan: 'Elite', status: 'Activo', expires: '28/04/2026', initials: 'DF' },
];

// Live simulation data
const liveNames = ['Sofía Méndez', 'Tomás Herrera', 'Valentina Paz', 'Nicolás Ruiz', 'Camila Ortega', 'Lucas Romero', 'Martina Silva', 'Agustín Díaz', 'Florencia Luna', 'Mateo Vargas', 'Julieta Morales', 'Gonzalo Ríos'];
const liveClasses = [
  { name: 'CrossFit', time: '18:00', instructor: 'Pablo M.', capacity: 20, current: 14, color: 'from-red-600 to-red-800' },
  { name: 'Spinning', time: '18:30', instructor: 'Laura G.', capacity: 15, current: 12, color: 'from-amber-600 to-amber-800' },
  { name: 'Yoga', time: '19:00', instructor: 'Ana R.', capacity: 12, current: 7, color: 'from-purple-600 to-purple-800' },
  { name: 'Funcional', time: '19:30', instructor: 'Diego S.', capacity: 18, current: 16, color: 'from-green-600 to-green-800' },
];
const livePlans = ['Básico', 'Premium', 'Elite'];

const GymDemoPage: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewMode>('site');
  const [dashTab, setDashTab] = useState<'socios' | 'ingresos'>('socios');

  // Live simulation state
  const [liveEvents, setLiveEvents] = useState<Array<{ id: number; type: string; name: string; detail: string; time: string; icon: string }>>([]);
  const [liveClassData, setLiveClassData] = useState(liveClasses.map(c => ({ ...c })));
  const [liveActiveMembers, setLiveActiveMembers] = useState(23);
  const [liveTodayRevenue, setLiveTodayRevenue] = useState(142500);
  const [liveCheckins, setLiveCheckins] = useState(47);
  const [eventCounter, setEventCounter] = useState(0);

  const generateEvent = useCallback(() => {
    const name = liveNames[Math.floor(Math.random() * liveNames.length)];
    const plan = livePlans[Math.floor(Math.random() * livePlans.length)];
    const types = [
      { type: 'checkin', detail: 'ingresó al gimnasio', icon: '🚪' },
      { type: 'payment', detail: `pagó plan ${plan} — $${plan === 'Básico' ? '12.000' : plan === 'Premium' ? '18.500' : '27.000'}`, icon: '💳' },
      { type: 'class', detail: `se anotó en ${liveClasses[Math.floor(Math.random() * liveClasses.length)].name}`, icon: '🏃' },
      { type: 'checkout', detail: 'salió del gimnasio', icon: '👋' },
    ];
    const event = types[Math.floor(Math.random() * types.length)];
    const now = new Date();
    return {
      id: Date.now() + Math.random(),
      type: event.type,
      name,
      detail: event.detail,
      time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`,
      icon: event.icon,
    };
  }, []);

  useEffect(() => {
    if (view !== 'live') return;
    // Seed initial events
    const initial = Array.from({ length: 5 }, () => generateEvent());
    setLiveEvents(initial);

    const interval = setInterval(() => {
      const newEvent = generateEvent();
      setLiveEvents(prev => [newEvent, ...prev].slice(0, 15));
      setEventCounter(c => c + 1);

      // Update stats
      if (newEvent.type === 'checkin') {
        setLiveActiveMembers(m => m + 1);
        setLiveCheckins(c => c + 1);
      } else if (newEvent.type === 'checkout') {
        setLiveActiveMembers(m => Math.max(0, m - 1));
      } else if (newEvent.type === 'payment') {
        setLiveTodayRevenue(r => r + (newEvent.detail.includes('12.000') ? 12000 : newEvent.detail.includes('18.500') ? 18500 : 27000));
      } else if (newEvent.type === 'class') {
        setLiveClassData(prev => {
          const updated = [...prev];
          const idx = Math.floor(Math.random() * updated.length);
          if (updated[idx].current < updated[idx].capacity) updated[idx].current += 1;
          return updated;
        });
      }
    }, 2200);

    return () => clearInterval(interval);
  }, [view, generateEvent]);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d]/90 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center font-black text-sm tracking-tighter">IF</div>
            <span className="text-lg font-black tracking-tight hidden sm:inline">IRON<span className="text-red-500">FITNESS</span></span>
          </div>

          {/* View toggle buttons */}
          <div className="flex items-center gap-2">
            <button onClick={() => setView('site')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === 'site' ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              🌐 Sitio Web
            </button>
            <button onClick={() => setView('admin')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === 'admin' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              ⚙️ Panel Admin
            </button>
            <button onClick={() => setView('live')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${view === 'live' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              {view === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              📡 Ver Versión Interactiva
            </button>
            <div className="w-px h-5 bg-white/10 mx-1 hidden sm:block" />
            <button onClick={() => navigate('/demos')} className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors border border-gray-800 px-2 py-1 rounded hidden sm:block">← Volver a Demos</button>
          </div>
        </div>
      </nav>

      {/* ===== MAIN SITE VIEW ===== */}
      {view === 'site' && (
        <>
          {/* Hero */}
          <section className="relative pt-28 pb-16 md:pt-40 md:pb-28 px-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-transparent to-transparent" />
            <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[150px]" />
            <div className="relative max-w-5xl mx-auto">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-red-500/10 border border-red-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[11px] text-red-400 font-semibold uppercase tracking-wider">Nuevo: Pagos 100% online</span>
                </div>
                <h1 className="text-5xl md:text-8xl font-black leading-[0.9] tracking-tight mb-6">ENTRENÁ<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-orange-500">SIN LÍMITES</span></h1>
                <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed max-w-lg">Musculación, clases grupales, pileta y más. Elegí tu plan, pagá online y empezá hoy.</p>
                <div className="flex flex-wrap gap-3">
                  <a href="#planes" className="px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 transition-all hover:shadow-xl hover:shadow-red-600/20 active:scale-95 text-sm">Ver Planes</a>
                  <a href="#sedes" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-all text-sm">Nuestras Sedes →</a>
                </div>
              </div>
              <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg">
                {[{ value: '247', label: 'Socios activos' }, { value: '3', label: 'Sedes' }, { value: '6AM-11PM', label: 'Horario' }].map((s, i) => (
                  <div key={i} className="text-center"><div className="text-2xl md:text-3xl font-black text-white">{s.value}</div><div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{s.label}</div></div>
                ))}
              </div>
            </div>
          </section>

          {/* Trainers */}
          <section className="py-20 px-6 bg-[#090909] border-b border-white/5 animate-fade-up">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                <div>
                  <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-2">Staff Profesional</p>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">Entrená con los mejores</h2>
                </div>
                <button className="px-6 py-3 rounded-xl border border-white/10 text-xs font-bold hover:bg-white/5 transition-all">Ver todo el equipo</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 {[
                   { name: 'Alex Russo', role: 'Head Coach', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=500', spec: 'CrossFit' },
                   { name: 'Sarah Connor', role: 'Musculación', img: 'https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?auto=format&fit=crop&q=80&w=500', spec: 'Hipertrofia' },
                   { name: 'Mike T.', role: 'Boxeo', img: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80&w=500', spec: 'Funcional' },
                   { name: 'Julieta V.', role: 'Yoga & Pilates', img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=500', spec: 'Flexibilidad' },
                 ].map((t, i) => (
                   <div key={i} className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer">
                      <img src={t.img} alt={t.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                      <div className="absolute bottom-0 left-0 p-5">
                         <div className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-1">{t.spec}</div>
                         <h3 className="text-xl font-black text-white mb-0.5">{t.name}</h3>
                         <p className="text-xs text-gray-400">{t.role}</p>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          </section>

          {/* Planes */}
          <section id="planes" className="py-20 md:py-28 px-6 scroll-mt-20 animate-fade-up">
            <div className="max-w-5xl mx-auto">
              <div className="mb-14"><p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-2">Planes Mensuales</p><h2 className="text-3xl md:text-5xl font-black tracking-tight">Elegí tu plan</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {plans.map((plan) => (
                  <div key={plan.name} className={`relative rounded-2xl p-7 transition-all duration-300 ${plan.popular ? 'bg-gradient-to-b from-red-600 to-red-900 ring-1 ring-red-500/50 shadow-2xl shadow-red-600/10 scale-[1.02]' : 'bg-[#141414] border border-white/5 hover:border-white/10'}`}>
                    {plan.popular && <div className="absolute -top-3 right-6 bg-white text-red-600 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">Popular</div>}
                    <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${plan.popular ? 'text-red-200' : 'text-gray-500'}`}>{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-6"><span className="text-4xl font-black">${plan.price}</span><span className={`text-sm ${plan.popular ? 'text-red-200' : 'text-gray-500'}`}>/mes</span></div>
                    <ul className="space-y-3 mb-8">{plan.features.map((f, i) => (<li key={i} className={`flex items-start gap-2 text-sm ${plan.popular ? 'text-white/80' : 'text-gray-400'}`}><svg className={`w-4 h-4 mt-0.5 shrink-0 ${plan.popular ? 'text-white' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>{f}</li>))}</ul>
                    <button className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${plan.popular ? 'bg-white text-red-600 hover:bg-gray-100' : 'bg-red-600 text-white hover:bg-red-500'}`}>Elegir Plan</button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Sedes */}
          <section id="sedes" className="py-20 md:py-28 px-6 scroll-mt-20 bg-[#090909] animate-fade-up">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-14"><h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase mb-3">Encontranos<br />en todas partes</h2><p className="text-gray-500 text-base">No importa dónde estés, buscá tu Iron Fitness más cercano.</p></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {locations.map((loc, i) => (
                  <div key={loc.name} className={`group relative rounded-2xl overflow-hidden bg-[#141414] border border-white/5 hover:border-red-500/30 transition-all duration-300 animate-fade-up`} style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="h-44 relative overflow-hidden">
                       <img src={loc.image} alt={loc.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                       <div className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${loc.tag === 'SEDE CENTRAL' ? 'bg-red-600 text-white' : loc.tag === 'NUEVA' ? 'bg-green-500 text-black' : 'bg-gray-700 text-gray-300'}`}>{loc.tag}</div>
                    </div>
                    <div className="p-5 relative">
                       <h3 className="font-black text-xl tracking-wide mb-1 text-white group-hover:text-red-500 transition-colors">{loc.name}</h3>
                       <p className="text-xs text-gray-400 leading-relaxed font-medium">{loc.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Reseñas */}
          <section id="resenas" className="py-20 md:py-28 px-6 scroll-mt-20 animate-fade-up">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-14">
                <div className="shrink-0 text-center md:text-left">
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Excelente</p>
                  <div className="flex items-center gap-1 mb-1 justify-center md:justify-start">{[1,2,3,4].map(i => <svg key={i} className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}<svg className="w-6 h-6 text-amber-400/30" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg></div>
                  <p className="text-xs text-gray-500 mb-2">A base de <span className="font-bold text-white">127 reseñas</span></p>
                  <div className="text-xs text-gray-600 font-bold">Google</div>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {reviews.map((r, i) => (
                    <div key={i} className="bg-[#141414] rounded-xl p-5 border border-white/5">
                      <div className="flex items-center gap-3 mb-3"><div className={`w-9 h-9 rounded-full ${r.color} flex items-center justify-center text-white text-sm font-bold`}>{r.initial}</div><div className="flex-1 min-w-0"><div className="text-sm font-bold text-white truncate">{r.name}</div><div className="text-[10px] text-gray-500">{r.time}</div></div></div>
                      <div className="flex items-center gap-0.5 mb-2">{Array.from({ length: r.rating }).map((_, j) => <svg key={j} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}</div>
                      <p className="text-xs text-gray-400 leading-relaxed">{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 md:py-28 px-6 bg-gradient-to-b from-[#0d0d0d] to-red-950/10">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">EMPEZÁ HOY</h2>
              <p className="text-gray-400 text-base md:text-lg mb-8 max-w-md mx-auto">Elegí tu plan y empezá a entrenar. Tu primera semana es gratis.</p>
              <a href="#planes" className="inline-block px-10 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 transition-all hover:shadow-xl hover:shadow-red-600/20 active:scale-95">Ver Planes</a>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-white/5 py-10 px-6 bg-[#090909]">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-[10px] font-black">IF</div><span className="text-sm font-black tracking-tight">IRON<span className="text-red-500">FITNESS</span></span></div>
              <div className="flex items-center gap-4">{[
                <svg key="ig" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
                <svg key="fb" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
                <svg key="tt" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>,
                <svg key="yt" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
              ].map((icon, i) => <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-red-500/40 transition-all">{icon}</a>)}</div>
              <div className="flex items-center gap-6 text-xs text-gray-600"><span>📍 3 sedes en Argentina</span><span>📞 11-3775-8970</span></div>
            </div>
            <div className="max-w-5xl mx-auto mt-6 pt-4 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-2">
              <p className="text-[10px] text-gray-700">© 2026 Iron Fitness. Todos los derechos reservados.</p>
              <p className="text-[10px] text-gray-700">Demo creada por <button onClick={() => navigate('/')} className="text-red-500/50 hover:text-red-400 transition-colors">ArtechIA</button></p>
            </div>
          </footer>
        </>
      )}

      {/* ===== ADMIN VIEW ===== */}
      {view === 'admin' && (
        <div className="pt-20 pb-16">
          {/* Dashboard */}
          <section className="py-10 md:py-16 px-6">
            <div className="max-w-5xl mx-auto">
              <div className="mb-10"><p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-2">Panel Administrativo</p><h2 className="text-2xl md:text-4xl font-black tracking-tight">Gestión de Socios</h2></div>
              <div className="rounded-2xl bg-[#141414] border border-white/5 overflow-hidden">
                <div className="flex border-b border-white/5">
                  <button onClick={() => setDashTab('socios')} className={`flex-1 py-4 text-sm font-bold transition-all ${dashTab === 'socios' ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-500/5' : 'text-gray-500 hover:text-gray-300'}`}>👥 Socios</button>
                  <button onClick={() => setDashTab('ingresos')} className={`flex-1 py-4 text-sm font-bold transition-all ${dashTab === 'ingresos' ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-500/5' : 'text-gray-500 hover:text-gray-300'}`}>📊 Ingresos</button>
                </div>
                {dashTab === 'socios' && (
                  <div className="p-5 md:p-6 overflow-x-auto">
                    <table className="w-full text-sm"><thead><tr className="text-gray-500 text-xs uppercase tracking-wider"><th className="text-left pb-4 font-medium">Socio</th><th className="text-left pb-4 font-medium">Plan</th><th className="text-left pb-4 font-medium">Estado</th><th className="text-right pb-4 font-medium">Vencimiento</th></tr></thead>
                      <tbody className="divide-y divide-white/5">{members.map((m, i) => (
                        <tr key={i} className="hover:bg-white/[0.02] transition-colors"><td className="py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center text-[11px] font-bold">{m.initials}</div><span className="font-medium">{m.name}</span></div></td><td className="py-4"><span className="text-gray-400 bg-white/5 px-2 py-0.5 rounded text-xs">{m.plan}</span></td><td className="py-4"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${m.status === 'Activo' ? 'bg-green-500/10 text-green-400' : m.status === 'Por vencer' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>{m.status}</span></td><td className="py-4 text-right text-gray-500 font-mono text-xs">{m.expires}</td></tr>
                      ))}</tbody></table>
                  </div>
                )}
                {dashTab === 'ingresos' && (
                  <div className="p-5 md:p-6 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{[{ label: 'Ingresos Feb', value: '$3.2M', change: '+12%', up: true }, { label: 'Nuevos Socios', value: '18', change: '+5', up: true }, { label: 'Renovaciones', value: '43', change: '89%', up: true }, { label: 'Impagos', value: '4', change: '-2', up: false }].map((s, i) => (<div key={i} className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5"><div className="text-[10px] text-gray-500 uppercase tracking-wider">{s.label}</div><div className="text-xl font-black mt-1">{s.value}</div><div className={`text-xs font-semibold mt-1 ${s.up ? 'text-green-400' : 'text-red-400'}`}>{s.change}</div></div>))}</div>
                    <div className="bg-[#1a1a1a] rounded-xl p-5 border border-white/5"><div className="text-xs text-gray-500 uppercase tracking-wider mb-5">Ingresos últimos 6 meses</div><div className="flex items-end gap-3 h-36">{[65, 72, 80, 85, 78, 92].map((v, i) => (<div key={i} className="flex-1 flex flex-col items-center gap-2"><div className="w-full rounded-md bg-gradient-to-t from-orange-600/60 to-orange-500 transition-all" style={{ height: `${v}%` }} /><span className="text-[10px] text-gray-600 font-medium">{['Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb'][i]}</span></div>))}</div></div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Automations */}
          <section className="py-10 md:py-16 px-6 border-t border-white/5">
            <div className="max-w-5xl mx-auto">
              <div className="mb-10"><p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-2">Automatizaciones</p><h2 className="text-2xl md:text-4xl font-black tracking-tight">Todo funciona solo</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { emoji: '📩', title: 'Aviso de Renovación', desc: 'Cuando el plan está por vencer, el socio recibe un WhatsApp con link de pago directo.', preview: <div className="bg-[#0a0f0a] border-t border-green-900/30 p-4"><div className="flex items-center gap-2 mb-2"><div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center"><svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a.96.96 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg></div><span className="text-[10px] text-green-400 font-bold">Iron Fitness</span></div><div className="bg-[#1a2e1a] rounded-xl rounded-tl-none p-3 text-[12px] text-green-100 leading-relaxed">¡Hola Martín! 👋 Tu plan <strong>Premium</strong> vence el 15/03. Renová ahora con <strong>10% OFF</strong> → <span className="text-green-400 underline">pagar</span></div></div> },
                  { emoji: '🎉', title: 'Promociones Automáticas', desc: 'Envío masivo de promos segmentadas por plan, antigüedad o estado del socio.', preview: <div className="bg-[#111] border-t border-white/5 p-4"><div className="bg-gradient-to-r from-amber-600/10 to-red-600/10 rounded-xl p-4 border border-amber-500/10"><div className="text-xs font-bold text-amber-300 mb-1">🔥 Promo exclusiva</div><p className="text-[11px] text-gray-300">¡Traé un amigo y ambos entrenan <strong className="text-white">GRATIS</strong> una semana!</p><div className="mt-2 inline-block px-3 py-1 rounded-full bg-amber-600 text-white text-[10px] font-bold">Compartir</div></div></div> },
                  { emoji: '💳', title: 'Pago Online', desc: 'El socio paga desde el celular y su plan se activa al instante.', preview: <div className="bg-[#111] border-t border-white/5 p-4"><div className="flex items-center justify-between p-3 rounded-xl bg-[#1a1a1a] border border-white/5"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/></svg></div><div><div className="text-sm font-bold">$18.500</div><div className="text-[10px] text-gray-500">Plan Premium · Lucía R.</div></div></div><div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10"><div className="w-1.5 h-1.5 rounded-full bg-green-500"/><span className="text-[10px] text-green-400 font-bold">Acreditado</span></div></div></div> },
                  { emoji: '📊', title: 'Reportes Mensuales', desc: 'Dashboard con ingresos, renovaciones y proyecciones.', preview: <div className="bg-[#111] border-t border-white/5 p-4"><div className="grid grid-cols-3 gap-2">{[{ l: 'Socios', v: '247', c: 'text-white' }, { l: 'Renovación', v: '89%', c: 'text-green-400' }, { l: 'Ingresos', v: '$3.2M', c: 'text-orange-400' }].map((s, i) => <div key={i} className="bg-[#1a1a1a] rounded-lg p-3 text-center border border-white/5"><div className={`text-lg font-black ${s.c}`}>{s.v}</div><div className="text-[9px] text-gray-500 uppercase tracking-wider mt-0.5">{s.l}</div></div>)}</div></div> },
                ].map((a, idx) => (
                  <div key={idx} className="bg-[#141414] rounded-2xl border border-white/5 overflow-hidden hover:border-orange-500/20 transition-all"><div className="p-6"><div className="flex items-center gap-3 mb-2"><span className="text-2xl">{a.emoji}</span><h3 className="font-bold">{a.title}</h3></div><p className="text-sm text-gray-400 leading-relaxed">{a.desc}</p></div>{a.preview}</div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ===== LIVE INTERACTIVE VIEW ===== */}
      {view === 'live' && (
        <div className="pt-20 pb-16 bg-[#090909] text-white min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
          


          <section className="py-10 px-6">
            <div className="max-w-7xl mx-auto">
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                {/* Active Members Card */}
                <div className="bg-[#141414] rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl font-black text-white group-hover:scale-110 transition-transform">🏃</div>
                  <div className="relative z-10">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Entrenando Ahora</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-black tracking-tighter">{liveActiveMembers}</span>
                      <span className="text-lg text-green-500 font-bold">+{Math.floor(Math.random() * 3)}</span>
                    </div>
                    <div className="mt-4 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 w-[65%] animate-pulse" />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">Capacidad al 65%</p>
                  </div>
                </div>

                {/* Revenue Card */}
                <div className="bg-[#141414] rounded-3xl p-6 border border-white/5 relative overflow-hidden">
                   <div className="absolute -right-6 -top-6 w-32 h-32 bg-red-600/10 rounded-full blur-2xl" />
                   <div className="relative z-10">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Facturación Hoy</p>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-4xl font-black tracking-tight">${(liveTodayRevenue / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded-lg w-fit">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                      <span className="font-bold">+15% vs ayer</span>
                    </div>
                  </div>
                </div>

                {/* Check-ins Card */}
                <div className="bg-[#141414] rounded-3xl p-6 border border-white/5 flex flex-col justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Accesos Totales</p>
                    <p className="text-3xl font-black">{liveCheckins}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className={`h-8 w-1.5 rounded-full ${i > 8 ? 'bg-gray-800' : 'bg-red-600'}`} />
                    ))}
                  </div>
                </div>

                 {/* Classes Status */}
                 <div className="bg-gradient-to-br from-red-900/20 to-[#141414] rounded-3xl p-6 border border-red-500/10 flex flex-col justify-center text-center">
                    <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                      <span className="text-2xl">🔥</span>
                    </div>
                    <p className="text-lg font-bold">Clases "On Fire"</p>
                    <p className="text-xs text-red-200/60">CrossFit y Funcional al 90%</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Live Turnstile Feed */}
                <div className="lg:col-span-2 bg-[#141414] rounded-3xl border border-white/5 overflow-hidden flex flex-col h-[500px]">
                  <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-lg tracking-tight">Molinete de Acceso</h3>
                      <p className="text-xs text-gray-500">Actividad en tiempo real de socios</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                      <span className="text-[10px] font-bold text-green-500 uppercase">Live Feed</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-2 relative">
                    <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#141414] to-transparent z-10" />
                    {liveEvents.map((event) => (
                      <div key={event.id} className="group flex items-center gap-4 p-4 rounded-2xl bg-[#0a0f0a] border border-white/5 hover:border-red-500/20 hover:bg-[#1a1a1a] transition-all duration-300 animate-[fadeIn_0.4s_ease-out]">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg ${event.type === 'checkin' ? 'bg-green-500/10 text-green-500 shadow-green-500/10' : event.type === 'payment' ? 'bg-amber-500/10 text-amber-500 shadow-amber-500/10' : event.type === 'class' ? 'bg-red-500/10 text-red-500 shadow-red-500/10' : 'bg-blue-500/10 text-blue-500 shadow-blue-500/10'}`}>
                          {event.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-bold text-sm text-white group-hover:text-red-400 transition-colors">{event.name}</span>
                            <span className="text-[10px] font-mono text-gray-600 bg-black/30 px-2 py-0.5 rounded">{event.time}</span>
                          </div>
                          <p className="text-xs text-gray-400">{event.detail}</p>
                        </div>
                         {event.type === 'payment' && (
                          <div className="px-3 py-1 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold">
                            +$$$
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#141414] to-transparent z-10 pointer-events-none" />
                  </div>
                </div>

                {/* Class Monitor */}
                <div className="bg-[#141414] rounded-3xl border border-white/5 overflow-hidden flex flex-col h-[500px]">
                  <div className="p-6 border-b border-white/5">
                    <h3 className="font-black text-lg tracking-tight">Estado de Clases</h3>
                    <p className="text-xs text-gray-500">Capacidad y reservas</p>
                  </div>
                  
                  <div className="p-6 flex-1 space-y-6 overflow-y-auto">
                    {liveClassData.map((cls, i) => {
                      const pct = Math.min((cls.current / cls.capacity) * 100, 100);
                      const isHot = pct > 80;
                      return (
                        <div key={i} className="relative">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                               <span className="text-sm font-bold block">{cls.name}</span>
                               <span className="text-[10px] text-gray-500 uppercase tracking-wider">{cls.time} • Prof. {cls.instructor}</span>
                            </div>
                            <div className="text-right">
                              <span className={`text-lg font-black ${isHot ? 'text-red-500' : 'text-white'}`}>{cls.current}</span>
                              <span className="text-xs text-gray-600 font-medium">/{cls.capacity}</span>
                            </div>
                          </div>
                          <div className="h-3 bg-gray-800 rounded-full overflow-hidden relative">
                             <div className={`h-full rounded-full bg-gradient-to-r ${cls.color} transition-all duration-1000 relative`} style={{ width: `${pct}%` }}>
                                {isHot && <div className="absolute top-0 right-0 bottom-0 w-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />}
                             </div>
                          </div>
                          {isHot && <span className="absolute -top-1 right-0 translate-x-1/2 -translate-y-1/2 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                          </span>}
                        </div>
                      );
                    })}
                    
                    <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-black border border-white/5">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Acciones Rápidas</h4>
                        <div className="grid grid-cols-2 gap-2">
                           <button className="py-2.5 rounded-xl bg-white/5 hover:bg-red-600/20 hover:text-red-400 text-xs font-semibold transition-all border border-transparent hover:border-red-600/30">Enviar Push</button>
                           <button className="py-2.5 rounded-xl bg-white/5 hover:bg-red-600/20 hover:text-red-400 text-xs font-semibold transition-all border border-transparent hover:border-red-600/30">Abrir Molinete</button>
                        </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          <style>{`
            @keyframes fadeIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
            @keyframes shimmer { from { transform: translateX(-100%) skewX(-15deg); } to { transform: translateX(200%) skewX(-15deg); } }
            .animate-shimmer { animation: shimmer 2s infinite linear; }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default GymDemoPage;
