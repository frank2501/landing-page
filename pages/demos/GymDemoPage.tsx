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
  { name: 'BELGRANO', address: 'Cabildo 1800, Belgrano, CABA', tag: 'NUEVA', image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&w=800' },
  { name: 'CABALLITO', address: 'Av. Rivadavia 5100, Caballito, CABA', tag: 'NUEVA', image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80&w=800' },
  { name: 'QUILMES', address: 'Av. Mitre 600, Quilmes, Buenos Aires', tag: 'PRÓXIMAMENTE', image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&q=80&w=800' },
];

const members = [
  { name: 'Martín L.', plan: 'Premium', status: 'Activo', expires: '15/03/2026', initials: 'ML' },
  { name: 'Lucía R.', plan: 'Elite', status: 'Activo', expires: '22/03/2026', initials: 'LR' },
  { name: 'Carlos G.', plan: 'Básico', status: 'Por vencer', expires: '12/02/2026', initials: 'CG' },
  { name: 'Ana M.', plan: 'Premium', status: 'Vencido', expires: '01/02/2026', initials: 'AM' },
  { name: 'Diego F.', plan: 'Elite', status: 'Activo', expires: '28/04/2026', initials: 'DF' },
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
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

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
            <button onClick={() => setView('admin')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'admin' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              Funciones Disponibles
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
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1500" 
                alt="Gym Background" 
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d]/80 via-[#0d0d0d]/50 to-[#0d0d0d]" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-transparent to-transparent mix-blend-overlay" />
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

          {/* Schedule Grid */}
          <section id="horarios" className="py-20 px-6 bg-[#090909] border-b border-white/5 animate-fade-up">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-2">Cronograma</p>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">Actividades Semanales</h2>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#141414]">
                <table className="w-full text-sm text-left">
                  <thead className="text-gray-400 uppercase text-xs font-bold tracking-wider bg-white/5">
                    <tr>
                      <th className="px-6 py-4">Horario</th>
                      <th className="px-6 py-4">Lunes</th>
                      <th className="px-6 py-4">Martes</th>
                      <th className="px-6 py-4">Miércoles</th>
                      <th className="px-6 py-4">Jueves</th>
                      <th className="px-6 py-4">Viernes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      { t: '08:00', d: ['CrossFit', 'Yoga', 'CrossFit', 'Yoga', 'CrossFit'] },
                      { t: '10:00', d: ['Musculación', 'Pilates', 'Musculación', 'Pilates', 'Musculación'] },
                      { t: '18:00', d: ['Zumba', 'Funcional', 'Zumba', 'Funcional', 'Zumba'] },
                      { t: '19:30', d: ['Boxeo', 'Spinning', 'Boxeo', 'Spinning', 'Boxeo'] },
                      { t: '20:30', d: ['CrossFit', 'Yoga', 'CrossFit', 'Yoga', 'Funcional'] },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-bold text-white border-r border-white/5 bg-white/[0.02]">{row.t}</td>
                        {row.d.map((act, j) => (
                          <td key={j} className={`px-6 py-4 font-medium ${act === 'CrossFit' ? 'text-red-400' : act === 'Yoga' ? 'text-purple-400' : act === 'Funcional' ? 'text-green-400' : 'text-gray-300'}`}>{act}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                   { name: 'Alex R.', role: 'Head Coach', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=500', spec: 'CrossFit' },
                   { name: 'Javier M.', role: 'Musculación', img: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=500', spec: 'Hipertrofia' },
                   { name: 'Miguel T.', role: 'Boxeo', img: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80&w=500', spec: 'Funcional' },
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
              <div className="mb-10 text-center md:text-left md:flex md:items-end md:justify-between">
                <div>
                  <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-2">Planes flexibles</p>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight">Elegí tu plan</h2>
                </div>
                <div className="mt-4 md:mt-0 bg-[#141414] p-1 rounded-xl border border-white/10 inline-flex">
                  <button onClick={() => setBillingCycle('monthly')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>Mensual</button>
                  <button onClick={() => setBillingCycle('annual')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${billingCycle === 'annual' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-gray-400 hover:text-white'}`}>Anual (2 meses gratis)</button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {plans.map((plan) => {
                  const basePrice = parseInt(plan.price.replace('.', ''));
                  // In annual view: show monthly equivalent (total / 12)
                  const totalAnnual = basePrice * 10;
                  const monthlyEquivalent = Math.round(totalAnnual / 12);
                  const displayPrice = billingCycle === 'annual' ? monthlyEquivalent.toLocaleString('es-AR') : plan.price;
                  const period = '/mes'; // Always show /mes for the main price anchor
                  
                  return (
                  <div key={plan.name} className={`relative rounded-2xl p-7 transition-all duration-300 ${plan.popular ? 'bg-gradient-to-b from-red-600 to-red-900 ring-1 ring-red-500/50 shadow-2xl shadow-red-600/10 scale-[1.02]' : 'bg-[#141414] border border-white/5 hover:border-white/10'}`}>
                    {plan.popular && <div className="absolute -top-3 right-6 bg-white text-red-600 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">Popular</div>}
                    <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${plan.popular ? 'text-red-200' : 'text-gray-500'}`}>{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-6"><span className="text-4xl font-black">${displayPrice}</span><span className={`text-sm ${plan.popular ? 'text-red-200' : 'text-gray-500'}`}>{period}</span></div>
                    {billingCycle === 'annual' && <div className={`text-xs font-medium mb-6 -mt-4 ${plan.popular ? 'text-red-100/80' : 'text-gray-400'}`}>Facturado anualmente: ${totalAnnual.toLocaleString('es-AR')}</div>}
                    <ul className="space-y-3 mb-8">{plan.features.map((f, i) => (<li key={i} className={`flex items-start gap-2 text-sm ${plan.popular ? 'text-white/80' : 'text-gray-400'}`}><svg className={`w-4 h-4 mt-0.5 shrink-0 ${plan.popular ? 'text-white' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>{f}</li>))}</ul>
                    <button className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${plan.popular ? 'bg-white text-red-600 hover:bg-gray-100' : 'bg-red-600 text-white hover:bg-red-500'}`}>Elegir Plan</button>
                    {billingCycle === 'annual' && <p className="text-center text-[10px] opacity-60 mt-3 font-medium">2 meses bonificados</p>}
                  </div>
                  );
                })}
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

          {/* FAQ */}
          <section className="py-20 px-6 bg-[#090909] border-t border-white/5 animate-fade-up">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-black text-center mb-10">Preguntas Frecuentes</h2>
              <div className="space-y-4">
                {[
                  { q: '¿Tengo que pagar matrícula?', a: 'No, la inscripción es 100% gratuita. Solo pagás tu plan mensual.' },
                  { q: '¿Puedo ir a todas las sedes?', a: 'Sí, con el Plan Elite tenés acceso ilimitado a todas nuestras sucursales.' },
                  { q: '¿Necesito apto físico?', a: 'Sí, es obligatorio presentar el apto físico dentro de los primeros 30 días.' },
                  { q: '¿Cómo me doy de baja?', a: 'Podés cancelar tu suscripción en cualquier momento desde tu perfil online, sin vueltas.' },
                ].map((faq, i) => (
                  <div key={i} className="bg-[#141414] rounded-xl p-6 border border-white/5 hover:border-red-500/20 transition-colors">
                    <h3 className="font-bold text-white mb-2">{faq.q}</h3>
                    <p className="text-sm text-gray-400">{faq.a}</p>
                  </div>
                ))}
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
          <footer className="border-t border-white/5 py-12 px-6 bg-[#050505] text-sm md:text-base">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
               <div>
                  <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-[10px] font-black mt-1">IF</div><span className="text-lg font-black tracking-tight">IRON<span className="text-red-500">FITNESS</span></span></div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">La cadena de gimnasios líder en tecnología y rendimiento de Argentina.</p>
                  <div className="flex gap-3">
                    {[
                      <svg key="ig" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
                      <svg key="fb" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.871v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
                    ].map((icon, i) => <a key={i} href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-red-500/40 transition-all">{icon}</a>)}
                  </div>
               </div>
               <div>
                 <h4 className="font-bold text-white mb-4">Empresa</h4>
                 <ul className="space-y-2 text-xs text-gray-500">
                   <li><a href="#" className="hover:text-red-400 transition-colors">Sobre Nosotros</a></li>
                   <li><a href="#" className="hover:text-red-400 transition-colors">Sedes</a></li>
                   <li><a href="#" className="hover:text-red-400 transition-colors">Trabajá con nosotros</a></li>
                   <li><a href="#" className="hover:text-red-400 transition-colors">Prensa</a></li>
                 </ul>
               </div>
               <div>
                 <h4 className="font-bold text-white mb-4">Legales</h4>
                 <ul className="space-y-2 text-xs text-gray-500">
                   <li><a href="#" className="hover:text-red-400 transition-colors">Términos y Condiciones</a></li>
                   <li><a href="#" className="hover:text-red-400 transition-colors">Privacidad</a></li>
                   <li><a href="#" className="hover:text-red-400 transition-colors">Arrepentimiento</a></li>
                   <li><a href="#" className="hover:text-red-400 transition-colors">Reglamento interno</a></li>
                 </ul>
               </div>
               <div>
                 <h4 className="font-bold text-white mb-4">Contacto</h4>
                 <ul className="space-y-2 text-xs text-gray-500">
                   <li>Atención al Socio</li>
                   <li className="font-bold text-white">0800-555-IRON</li>
                   <li>info@ironfitness.com.ar</li>
                   <li>Av. Santa Fe 3200, Palermo</li>
                 </ul>
               </div>
            </div>
            <div className="max-w-6xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-[10px] text-gray-600">© 2026 Iron Fitness Argentina. Todos los derechos reservados.</p>
              <p className="text-[10px] text-gray-600">Powered by <button onClick={() => navigate('/')} className="text-red-500/50 hover:text-red-400 transition-colors font-bold">ArtechIA</button></p>
            </div>
          </footer>
        </>
      )}

      {/* ===== ADMIN VIEW ===== */}
      {view === 'admin' && (
        <div className="pt-20 pb-16 bg-[#090909] text-white">
          <section className="py-12 md:py-20 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="mb-12 text-center text-white">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Funciones Disponibles</h2>
                <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
                  Soluciones inteligentes diseñadas para escalar tu gimnasio y automatizar los cobros.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { 
                    category: 'ADMINISTRACIÓN',
                    title: 'Base de datos de socios', 
                    desc: 'Todos los datos de tus socios organizados. Quiénes son, qué plan tienen y cuándo empezaron.',
                    icon: '👥',
                    features: ['Ficha digital completa', 'Foto de perfil', 'Historial de pagos']
                  },
                  { 
                    category: 'FINANZAS',
                    title: 'Cobros Multi-plataforma', 
                    desc: 'Aceptá pagos con tarjeta, Mercado Pago o transferencias. El sistema concilia todo por vos.',
                    icon: '💳',
                    features: ['Link de pago directo', 'Cobro al instante', 'Cero manejo de efectivo']
                  },
                  { 
                    category: 'RECAUDACIÓN',
                    title: 'Débito Automático', 
                    desc: 'El sistema les cobra a los socios todos los meses automáticamente. Garantizá tus ingresos sin demoras.',
                    icon: '🔄',
                    features: ['Cobro recurrente', 'Sin errores humanos', 'Máxima puntualidad']
                  },
                  { 
                    category: 'MARKETING',
                    title: 'Fidelización y Ofertas', 
                    desc: 'Creá promociones especiales y cupones de descuento para atraer gente nueva o premiar a tus alumnos.',
                    icon: '🎁',
                    features: ['Campañas fáciles', 'Vencimientos automáticos', 'Incremento de ventas']
                  },
                  { 
                    category: 'AUTOMATIZACIÓN',
                    title: 'Recordatorios WhatsApp', 
                    desc: 'Mensajes automáticos avisando que la cuota está por vencer para que nadie se olvide de pagar.',
                    icon: '💬',
                    features: ['Atención personalizada', 'Aviso 48hs antes', 'Más orden administrativo']
                  },
                  { 
                    category: 'RETENCIÓN',
                    title: 'Renovación de Matrícula', 
                    desc: 'Detectamos quiénes están por dejar de venir y les enviamos una oferta para que renueven su plan.',
                    icon: '🔔',
                    features: ['Evita la deserción', 'Proactividad total', 'Recupero de alumnos']
                  },
                  { 
                    category: 'CONTROL',
                    title: 'Gestión de Accesos', 
                    desc: 'Registrá quién entra al gimnasio en tiempo real. Obtené reportes de horas pico y asistencia.',
                    icon: '🦾',
                    features: ['Control por código/QR', 'Reporte de flujo', 'Seguridad total']
                  },
                  { 
                    category: 'VISIBILIDAD',
                    title: 'Posicionamiento Google', 
                    desc: 'Hacemos que tu gimnasio sea el primero que aparezca cuando alguien busca entrenar cerca.',
                    icon: '🚀',
                    features: ['Clientes nuevos cada semana', 'Mapa local activo', 'Presencia profesional']
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#0A0A0A] rounded-2xl border border-white/5 p-8 transition-all group relative overflow-hidden flex flex-col hover:border-orange-500/30 shadow-2xl">
                    <div className="absolute top-0 right-0 p-6 opacity-3 text-4xl group-hover:scale-110 transition-transform">{item.icon}</div>
                    
                    <div className="mb-4">
                      <span className="text-[10px] font-black text-orange-500 tracking-widest uppercase py-1 px-2 bg-orange-500/10 rounded-md">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-1">{item.desc}</p>

                    <div className="space-y-2 mb-8 border-t border-white/5 pt-4">
                      {item.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                          <span className="text-orange-500">→</span> {f}
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => window.open(`https://wa.me/5491137758970?text=${encodeURIComponent(`Hola! Me interesa la función de "${item.title}" para mi gimnasio. ¿Me podrías dar más asesoramiento?`)}`, '_blank')}
                      className="w-full py-3 rounded-lg text-xs font-bold bg-white/5 text-gray-300 hover:bg-orange-500 hover:text-white transition-all border border-white/10 group-hover:border-orange-500/50"
                    >
                      Pedir Asesoramiento
                    </button>
                  </div>
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
