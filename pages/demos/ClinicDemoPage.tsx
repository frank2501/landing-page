import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

type ViewMode = 'site' | 'admin' | 'live';

const specialties = ['Clínica Médica', 'Pediatría', 'Cardiología', 'Dermatología', 'Traumatología'];

const doctors = [
  { name: 'Dra. Valentina Ruiz', specialty: 'Clínica Médica', avatar: 'VR' },
  { name: 'Dr. Sebastián Torres', specialty: 'Cardiología', avatar: 'ST' },
  { name: 'Dra. Camila Herrera', specialty: 'Pediatría', avatar: 'CH' },
  { name: 'Dr. Nicolás Paz', specialty: 'Dermatología', avatar: 'NP' },
];

const timeSlots = [
  { time: '08:00', available: true }, { time: '08:30', available: false },
  { time: '09:00', available: true }, { time: '09:30', available: true },
  { time: '10:00', available: false }, { time: '10:30', available: false },
  { time: '11:00', available: true }, { time: '11:30', available: true },
  { time: '14:00', available: true }, { time: '14:30', available: true },
  { time: '15:00', available: false }, { time: '15:30', available: true },
  { time: '16:00', available: true }, { time: '16:30', available: true },
];

const patients = [
  { name: 'Carolina Méndez', age: 34, lastVisit: '05/02/2026', nextTurn: '14/02 10:00', status: 'Activo', initials: 'CM' },
  { name: 'Ricardo Suárez', age: 58, lastVisit: '01/02/2026', nextTurn: '12/02 09:00', status: 'Activo', initials: 'RS' },
  { name: 'Florencia Díaz', age: 27, lastVisit: '28/01/2026', nextTurn: '-', status: 'Sin turno', initials: 'FD' },
  { name: 'Martín Álvarez', age: 45, lastVisit: '10/01/2026', nextTurn: '15/02 14:30', status: 'Activo', initials: 'MA' },
  { name: 'Lucía Paredes', age: 12, lastVisit: '20/01/2026', nextTurn: '13/02 08:30', status: 'Activo', initials: 'LP' },
];

// Live simulation data
const patientNames = ['Carolina Méndez', 'Ricardo Suárez', 'Florencia Díaz', 'Martín Álvarez', 'Lucía Paredes', 'Ana Bermúdez', 'Jorge Vidal', 'Sandra Paz', 'Diego Romero', 'Paula Luna', 'Gabriel Ríos', 'Valentina Ortega'];
const doctorNames = ['Dra. Ruiz', 'Dr. Torres', 'Dra. Herrera', 'Dr. Paz'];
const specNames = ['Clínica', 'Cardio', 'Pediatría', 'Dermato', 'Trauma'];

const ClinicDemoPage: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewMode>('site');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Clínica Médica');
  const [selectedDoctor, setSelectedDoctor] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [heroTextIndex, setHeroTextIndex] = useState(0);
  const heroWords = ['buenas manos', 'manos expertas', 'manos seguras'];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroTextIndex(prev => (prev + 1) % heroWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  const [dashTab, setDashTab] = useState<'pacientes' | 'agenda'>('pacientes');

  // Live state
  const [liveEvents, setLiveEvents] = useState<Array<{ id: number; type: string; name: string; detail: string; time: string; icon: string }>>([]);
  const [liveWaiting, setLiveWaiting] = useState(4);
  const [liveAttended, setLiveAttended] = useState(12);
  const [liveTurnosHoy, setLiveTurnosHoy] = useState(28);
  const [liveQueue, setLiveQueue] = useState([
    { name: 'Ricardo Suárez', doctor: 'Dr. Torres', time: '09:00', status: 'En consultorio', spec: 'Cardio' },
    { name: 'Lucía Paredes', doctor: 'Dra. Herrera', time: '09:30', status: 'En espera', spec: 'Pediatría' },
    { name: 'Martín Álvarez', doctor: 'Dr. Paz', time: '10:00', status: 'En espera', spec: 'Dermato' },
    { name: 'Ana Bermúdez', doctor: 'Dra. Ruiz', time: '11:00', status: 'Próximo', spec: 'Clínica' },
    { name: 'Jorge Vidal', doctor: 'Dr. Torres', time: '11:30', status: 'Próximo', spec: 'Cardio' },
  ]);
  const [eventCounter, setEventCounter] = useState(0);

  const filteredDoctors = doctors.filter(d => d.specialty === selectedSpecialty);

  const generateEvent = useCallback(() => {
    const name = patientNames[Math.floor(Math.random() * patientNames.length)];
    const doctor = doctorNames[Math.floor(Math.random() * doctorNames.length)];
    const spec = specNames[Math.floor(Math.random() * specNames.length)];
    
    // Weighted random event generation
    const rand = Math.random();
    let type = 'booking';
    
    if (rand < 0.3) type = 'ai_confirm';
    else if (rand < 0.5) type = 'arrival';
    else if (rand < 0.7) type = 'attended';
    else if (rand < 0.85) type = 'agenda_auto';
    else type = 'booking';

    let detail = '';
    let icon = '';

    if (type === 'ai_confirm') {
       detail = `IA: Confirmando turno con ${name}`;
       icon = '🤖';
    } else if (type === 'arrival') {
       detail = `${name} llegó (Pre-checkin OK)`;
       icon = '✅';
    } else if (type === 'attended') {
       detail = `${name} ingresó a consulta con ${doctor}`;
       icon = '👨‍⚕️';
    } else if (type === 'agenda_auto') {
       detail = `Turno liberado y re-asignado (Lista Espera)`;
       icon = '⚡';
    } else if (type === 'booking') {
       detail = `Nuevo turno web para ${spec}`;
       icon = '📅';
    }

    const now = new Date();
    return { id: Date.now() + Math.random(), type, name, detail, time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`, icon };
  }, []);

  useEffect(() => {
    if (view !== 'live') return;
    const initial = Array.from({ length: 5 }, () => generateEvent());
    setLiveEvents(initial);
    const interval = setInterval(() => {
      const newEvent = generateEvent();
      setLiveEvents(prev => [newEvent, ...prev].slice(0, 15));
      setEventCounter(c => c + 1);
      
      if (newEvent.type === 'arrival') setLiveWaiting(w => w + 1);
      else if (newEvent.type === 'attended') { setLiveAttended(a => a + 1); setLiveWaiting(w => Math.max(0, w - 1)); }
      else if (newEvent.type === 'booking') setLiveTurnosHoy(t => t + 1);
      
      // Update queue randomly
      if (Math.random() < 0.3) {
        setLiveQueue(prev => {
          const updated = [...prev];
          const idx = Math.floor(Math.random() * updated.length);
          const statuses = ['En consultorio', 'En espera', 'Próximo', 'Atendido'];
          updated[idx] = { ...updated[idx], status: statuses[Math.floor(Math.random() * statuses.length)] };
          return updated;
        });
      }
    }, 2500); // Slower update for better readability
    return () => clearInterval(interval);
  }, [view, generateEvent]);

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#1A2332]" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>

      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-[#E5EAF2] shadow-sm shadow-[#1A2332]/[0.02]">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
            <span className="text-lg font-bold hidden sm:inline">Salud<span className="text-[#2563EB]">+</span></span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setView('site')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === 'site' ? 'bg-[#2563EB] text-white' : 'text-[#7C8DB5] hover:text-[#1A2332] hover:bg-[#F0F3F9]'}`}>
              🌐 Sitio Web
            </button>
            <button onClick={() => setView('admin')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === 'admin' ? 'bg-orange-500 text-white' : 'text-[#7C8DB5] hover:text-[#1A2332] hover:bg-[#F0F3F9]'}`}>
              ⚙️ Panel Admin
            </button>
            <button onClick={() => setView('live')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${view === 'live' ? 'bg-green-600 text-white' : 'text-[#7C8DB5] hover:text-[#1A2332] hover:bg-[#F0F3F9]'}`}>
              {view === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              📡 Ver Versión Interactiva
            </button>
            <div className="w-px h-5 bg-[#E5EAF2] mx-1 hidden sm:block" />
            <button onClick={() => navigate('/demos')} className="text-[10px] text-[#7C8DB5] hover:text-[#2563EB] transition-colors border border-[#E5EAF2] px-2 py-1 rounded hidden sm:block">← Volver a Demos</button>
          </div>
        </div>
      </nav>

      {/* ===== MAIN SITE VIEW ===== */}
      {view === 'site' && (
        <>
          {/* Hero */}
          <section className="relative pt-28 pb-16 md:pt-40 md:pb-24 px-6 bg-gradient-to-b from-[#EFF4FF] to-[#F7F9FC]">
            <div className="max-w-5xl mx-auto text-center animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-semibold"><div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />Turnos disponibles hoy</div>
              <h1 className="text-4xl md:text-7xl font-bold text-[#1A2332] leading-[0.95] tracking-tight mb-4 min-h-[1.2em]">
                Tu salud, en <span className="text-[#2563EB] inline-block relative transition-all duration-500 transform translate-y-0 opacity-100 key={heroTextIndex}">{heroWords[heroTextIndex]}</span>
              </h1>
              <p className="text-lg md:text-xl text-[#7C8DB5] mb-10 max-w-lg mx-auto leading-relaxed">Sacá turno online en segundos. Elegí especialidad, profesional y horario.</p>
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                {[{ label: 'Pacientes', value: '1,240', icon: '👥' }, { label: 'Turnos / mes', value: '186', icon: '📅' }, { label: 'Especialidades', value: '5', icon: '🩺' }, { label: 'Asistencia', value: '94%', icon: '✅' }].map((stat, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white border border-[#E5EAF2] shadow-sm shadow-[#1A2332]/[0.02]"><span className="text-xl">{stat.icon}</span><div className="text-left"><div className="text-lg md:text-xl font-bold text-[#1A2332]">{stat.value}</div><div className="text-[10px] text-[#7C8DB5]">{stat.label}</div></div></div>
                ))}
              </div>
            </div>
          </section>

          {/* Obras Sociales */}
          <section className="py-10 border-b border-[#E5EAF2] bg-white overflow-hidden animate-fade-up">
             <div className="max-w-6xl mx-auto px-6">
                <p className="text-center text-xs font-bold text-[#7C8DB5] uppercase tracking-widest mb-6">Trabajamos con todas las obras sociales</p>
                <div className="flex items-center justify-between gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                   {['OSDE', 'Swiss Medical', 'Galeno', 'Medicus', 'OMINT', 'Sancor Salud'].map((os, i) => (
                      <div key={i} className="text-xl md:text-2xl font-black text-[#1A2332] whitespace-nowrap">{os}</div>
                   ))}
                </div>
             </div>
          </section>

          {/* Turnos */}
          <section id="turnos" className="py-16 md:py-24 px-6 scroll-mt-20 animate-fade-up">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10"><p className="text-[#2563EB] text-xs font-bold uppercase tracking-widest mb-2">Reserva Online</p><h2 className="text-3xl md:text-5xl font-bold tracking-tight">Pedí tu turno</h2></div>
              <div className="bg-white rounded-2xl border border-[#E5EAF2] shadow-lg shadow-[#1A2332]/[0.03] overflow-hidden">
                <div className="p-6 md:p-8 space-y-8">
                  <div><div className="flex items-center gap-3 mb-4"><div className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold">1</div><span className="text-sm font-bold text-[#1A2332]">Elegí la especialidad</span></div><div className="flex flex-wrap gap-2">{specialties.map(s => <button key={s} onClick={() => { setSelectedSpecialty(s); setSelectedDoctor(0); setSelectedSlot(null); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedSpecialty === s ? 'bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/20' : 'bg-[#F7F9FC] text-[#4A5B7A] border border-[#E5EAF2] hover:border-[#2563EB]/30'}`}>{s}</button>)}</div></div>
                  <hr className="border-[#F0F3F9]" />
                  <div><div className="flex items-center gap-3 mb-4"><div className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold">2</div><span className="text-sm font-bold text-[#1A2332]">Elegí el profesional</span></div><div className="flex flex-wrap gap-3">{filteredDoctors.length > 0 ? filteredDoctors.map((d, idx) => <button key={d.name} onClick={() => { setSelectedDoctor(idx); setSelectedSlot(null); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${selectedDoctor === idx ? 'bg-[#EFF4FF] border-2 border-[#2563EB]/30 shadow-sm' : 'bg-[#F7F9FC] border-2 border-transparent hover:border-[#E5EAF2]'}`}><div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold ${selectedDoctor === idx ? 'bg-[#2563EB] text-white' : 'bg-[#E5EAF2] text-[#7C8DB5]'}`}>{d.avatar}</div><div className="text-left"><div className="text-sm font-bold text-[#1A2332]">{d.name}</div><div className="text-[11px] text-[#7C8DB5]">{d.specialty}</div></div></button>) : <p className="text-sm text-[#7C8DB5]">No hay profesionales para esta especialidad en la demo.</p>}</div></div>
                  <hr className="border-[#F0F3F9]" />
                  <div><div className="flex items-center gap-3 mb-4"><div className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold">3</div><span className="text-sm font-bold text-[#1A2332]">Elegí el horario</span><span className="text-xs text-[#7C8DB5] bg-[#F7F9FC] px-2 py-0.5 rounded-full">14 Feb 2026</span></div><div className="grid grid-cols-4 md:grid-cols-7 gap-2">{timeSlots.map((slot, idx) => <button key={idx} disabled={!slot.available} onClick={() => setSelectedSlot(idx)} className={`py-2.5 rounded-lg text-sm font-medium transition-all ${!slot.available ? 'bg-[#F7F9FC] text-[#C4CCDB] cursor-not-allowed line-through' : selectedSlot === idx ? 'bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/20' : 'bg-[#F7F9FC] text-[#4A5B7A] border border-[#E5EAF2] hover:border-[#2563EB]/30'}`}>{slot.time}</button>)}</div></div>
                  <button className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${selectedSlot !== null ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-lg shadow-[#2563EB]/20 active:scale-[0.98]' : 'bg-[#F0F3F9] text-[#A0AEC0] cursor-not-allowed'}`}>{selectedSlot !== null ? `✓ Confirmar Turno — ${timeSlots[selectedSlot].time} hs` : 'Seleccioná un horario disponible'}</button>
                </div>
              </div>
            </div>
          </section>

          {/* Equipo */}
          <section id="equipo" className="py-16 md:py-24 px-6 bg-white scroll-mt-20 animate-fade-up">
            <div className="max-w-5xl mx-auto"><div className="text-center mb-10"><p className="text-[#2563EB] text-xs font-bold uppercase tracking-widest mb-2">Nuestro Equipo</p><h2 className="text-3xl md:text-5xl font-bold tracking-tight">Profesionales de excelencia</h2></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{doctors.map((d, i) => <div key={i} className="bg-white rounded-2xl p-6 border border-[#E5EAF2] text-center hover:shadow-lg hover:shadow-[#2563EB]/5 transition-all"><div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#2563EB]/10 to-blue-100 flex items-center justify-center text-xl font-bold text-[#2563EB] mb-3">{d.avatar}</div><h3 className="font-bold text-sm text-[#1A2332] mb-0.5">{d.name}</h3><p className="text-[11px] text-[#7C8DB5]">{d.specialty}</p></div>)}</div>
            </div>
          </section>

          {/* Blog (Consejos de Salud) */}
          <section className="py-16 md:py-24 px-6 bg-[#F7F9FC] animate-fade-up">
             <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                   <div>
                      <p className="text-[#2563EB] text-xs font-bold uppercase tracking-widest mb-2">Blog de Salud</p>
                      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#1A2332]">Consejos para vos</h2>
                   </div>
                   <button className="px-6 py-3 rounded-xl border border-[#E5EAF2] text-xs font-bold text-[#4A5B7A] hover:bg-white transition-all">Ver todos los artículos</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {[
                      { cat: 'Nutrición', title: 'Alimentación saludable en invierno', date: '10 Feb 2026', img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=500' },
                      { cat: 'Cardiología', title: '5 hábitos para cuidar tu corazón', date: '08 Feb 2026', img: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=500' },
                      { cat: 'Pediatría', title: 'Vacunación: Calendario 2026', date: '05 Feb 2026', img: 'https://images.unsplash.com/photo-1632053001335-e6a8d804245b?auto=format&fit=crop&q=80&w=500' }
                   ].map((post, i) => (
                      <div key={i} className="group cursor-pointer">
                         <div className="rounded-2xl overflow-hidden aspect-video mb-4 relative">
                            <img src={post.img} alt={post.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold text-[#2563EB] uppercase tracking-wide">{post.cat}</div>
                         </div>
                         <h3 className="font-bold text-lg text-[#1A2332] leading-tight mb-2 group-hover:text-[#2563EB] transition-colors">{post.title}</h3>
                         <p className="text-xs text-[#7C8DB5]">{post.date} • 5 min de lectura</p>
                      </div>
                   ))}
                </div>
             </div>
          </section>

          {/* CTA + Footer */}
          <section className="py-16 md:py-24 px-6 bg-[#2563EB]"><div className="max-w-2xl mx-auto text-center"><h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">Cuidamos tu salud</h2><p className="text-blue-200 text-base mb-8">Sacá turno online, sin esperas. Tu consulta a un click.</p><a href="#turnos" className="inline-block px-10 py-4 bg-white text-[#2563EB] font-bold rounded-xl hover:bg-blue-50 transition-all active:scale-95 shadow-lg shadow-[#1D4ED8]/30">Pedir Turno</a></div></section>

          <footer className="border-t border-[#E5EAF2] py-10 px-6 bg-white">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3"><div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center"><svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></div><span className="text-sm font-bold text-[#1A2332]">Salud<span className="text-[#2563EB]">+</span></span></div>
              <div className="flex items-center gap-3">{[
                <svg key="ig" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
                <svg key="fb" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
                <svg key="wa" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a.96.96 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>,
              ].map((icon, i) => <a key={i} href="#" className="w-9 h-9 rounded-full bg-[#2563EB]/5 border border-[#E5EAF2] flex items-center justify-center text-[#7C8DB5] hover:text-[#2563EB] hover:border-[#2563EB]/30 transition-all">{icon}</a>)}</div>
              <div className="text-xs text-[#7C8DB5]">📍 Av. Corrientes 3500, CABA · 📞 11-3775-8970</div>
            </div>
            <div className="max-w-5xl mx-auto mt-6 pt-4 border-t border-[#F0F3F9] flex flex-col md:flex-row items-center justify-between gap-2"><p className="text-[10px] text-[#A0AEC0]">© 2026 Centro Médico Salud+</p><p className="text-[10px] text-[#C4CCDB]">Demo por <button onClick={() => navigate('/')} className="text-[#2563EB]/40 hover:text-[#2563EB] transition-colors">ArtechIA</button></p></div>
          </footer>
        </>
      )}

      {/* ===== ADMIN VIEW ===== */}
      {view === 'admin' && (
        <div className="pt-20 pb-16 bg-[#EFF4FF] min-h-screen">
          <section className="py-10 md:py-16 px-6">
            <div className="max-w-5xl mx-auto">
              <div className="mb-10"><p className="text-orange-600 text-xs font-bold uppercase tracking-widest mb-2">Panel de Gestión</p><h2 className="text-2xl md:text-4xl font-bold tracking-tight">Pacientes y Agenda</h2></div>
              <div className="bg-white rounded-2xl border border-[#E5EAF2] shadow-lg shadow-[#1A2332]/[0.03] overflow-hidden max-w-4xl mx-auto">
                <div className="flex border-b border-[#E5EAF2]"><button onClick={() => setDashTab('pacientes')} className={`flex-1 py-4 text-sm font-semibold transition-all ${dashTab === 'pacientes' ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50' : 'text-[#7C8DB5] hover:text-[#1A2332]'}`}>👥 Pacientes</button><button onClick={() => setDashTab('agenda')} className={`flex-1 py-4 text-sm font-semibold transition-all ${dashTab === 'agenda' ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50' : 'text-[#7C8DB5] hover:text-[#1A2332]'}`}>📅 Agenda del Día</button></div>
                {dashTab === 'pacientes' && (<div className="p-5 md:p-6 overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-[#7C8DB5] text-xs uppercase tracking-wider"><th className="text-left pb-4 font-medium">Paciente</th><th className="text-left pb-4 font-medium">Edad</th><th className="text-left pb-4 font-medium">Última Visita</th><th className="text-left pb-4 font-medium">Próximo Turno</th><th className="text-right pb-4 font-medium">Estado</th></tr></thead><tbody className="divide-y divide-[#F0F3F9]">{patients.map((p, idx) => <tr key={idx} className="hover:bg-[#F7F9FC] transition-colors"><td className="py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-[11px] font-bold text-orange-700">{p.initials}</div><span className="font-medium text-[#1A2332]">{p.name}</span></div></td><td className="py-4 text-[#7C8DB5]">{p.age}</td><td className="py-4 text-[#7C8DB5] font-mono text-xs">{p.lastVisit}</td><td className="py-4 text-[#7C8DB5] font-mono text-xs">{p.nextTurn}</td><td className="py-4 text-right"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.status === 'Activo' ? 'bg-green-50 text-green-600' : 'bg-[#F0F3F9] text-[#7C8DB5]'}`}>{p.status}</span></td></tr>)}</tbody></table></div>)}
                {dashTab === 'agenda' && (<div className="p-5 md:p-6 space-y-3"><div className="flex items-center justify-between mb-2"><span className="text-xs text-[#7C8DB5] font-medium">Hoy — 14 de Febrero, 2026</span><span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">5 turnos</span></div>{[{ time: '08:00', patient: 'Carolina Méndez', doctor: 'Dra. Ruiz', type: 'Control', status: 'Atendido' }, { time: '09:00', patient: 'Ricardo Suárez', doctor: 'Dr. Torres', type: 'Consulta', status: 'En espera' }, { time: '09:30', patient: 'Lucía Paredes', doctor: 'Dra. Herrera', type: 'Pediatría', status: 'Próximo' }, { time: '10:00', patient: 'Martín Álvarez', doctor: 'Dr. Paz', type: 'Dermatología', status: 'Próximo' }, { time: '11:00', patient: 'Ana Bermúdez', doctor: 'Dra. Ruiz', type: 'Estudios', status: 'Próximo' }].map((t, i) => <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${t.status === 'Atendido' ? 'bg-[#F7F9FC] border-[#E5EAF2] opacity-50' : t.status === 'En espera' ? 'bg-orange-50 border-orange-200' : 'bg-white border-[#E5EAF2]'}`}><div className="text-sm font-mono text-[#7C8DB5] w-14 shrink-0 font-medium">{t.time}</div><div className="flex-1 min-w-0"><div className="text-sm font-bold text-[#1A2332] truncate">{t.patient}</div><div className="text-[11px] text-[#7C8DB5]">{t.doctor} · {t.type}</div></div><span className={`text-[11px] px-3 py-1 rounded-full font-semibold shrink-0 ${t.status === 'Atendido' ? 'bg-[#E5EAF2] text-[#7C8DB5]' : t.status === 'En espera' ? 'bg-orange-500 text-white' : 'bg-[#F0F3F9] text-[#4A5B7A]'}`}>{t.status}</span></div>)}</div>)}
              </div>
            </div>
          </section>

          {/* Automations */}
          <section className="py-10 md:py-16 px-6 border-t border-[#E5EAF2]">
            <div className="max-w-5xl mx-auto">
              <div className="mb-10"><p className="text-orange-600 text-xs font-bold uppercase tracking-widest mb-2">Automatizaciones</p><h2 className="text-2xl md:text-4xl font-bold tracking-tight">El consultorio trabaja solo</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { emoji: '📩', title: 'Recordatorio de Turno', desc: 'WhatsApp automático 24hs antes.', preview: <div className="bg-[#F0F9F2] border-t border-green-100 p-4"><div className="bg-white rounded-xl p-3 border border-green-100 text-xs text-[#4B5E4F] leading-relaxed">Hola Carolina 👋 Recordamos tu turno:<br/>🩺 <strong>Dra. Ruiz</strong> · 14/02 10:00 hs<br/>¿Confirmás? SI o NO.</div></div> },
                  { emoji: '📋', title: 'Ficha Digital', desc: 'Antecedentes, alergias y recetas.', preview: <div className="bg-[#F7F9FC] border-t border-[#E5EAF2] p-4"><div className="grid grid-cols-2 gap-2">{[{ l: 'Alergias', v: 'Penicilina', c: 'text-red-500 bg-red-50' }, { l: 'Grupo', v: 'A+', c: 'text-blue-600 bg-blue-50' }, { l: 'Obra Social', v: 'OSDE 310', c: 'text-green-600 bg-green-50' }, { l: 'Última', v: '05/02/26', c: 'text-[#7C8DB5] bg-[#F0F3F9]' }].map((f, i) => <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E5EAF2]"><span className="text-[10px] text-[#7C8DB5]">{f.l}</span><span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${f.c}`}>{f.v}</span></div>)}</div></div> },
                  { emoji: '🔔', title: 'Turno por Cancelación', desc: 'Notificación a lista de espera.', preview: <div className="bg-[#FFFBF5] border-t border-amber-100 p-4"><div className="bg-white rounded-xl p-4 border border-amber-200"><div className="text-xs text-amber-700 font-bold mb-1">⚡ ¡Turno disponible!</div><p className="text-xs text-[#7C8DB5]">Con <strong className="text-[#1A2332]">Dr. Torres</strong> el 13/02 10:00.</p><div className="flex gap-2 mt-3"><button className="px-3 py-1.5 rounded-lg bg-orange-500 text-white text-[11px] font-bold">Reservar</button><button className="px-3 py-1.5 rounded-lg bg-[#F0F3F9] text-[#7C8DB5] text-[11px]">No</button></div></div></div> },
                  { emoji: '📊', title: 'Reportes de Turnos', desc: 'Asistencia, cancelaciones y demanda.', preview: <div className="bg-[#F7F9FC] border-t border-[#E5EAF2] p-4"><div className="grid grid-cols-3 gap-2">{[{ l: 'Feb', v: '186', c: 'text-green-600 bg-green-50' }, { l: 'Cancel.', v: '12', c: 'text-amber-600 bg-amber-50' }, { l: 'No asist.', v: '5', c: 'text-red-500 bg-red-50' }].map((s, i) => <div key={i} className={`p-2 rounded-lg text-center ${s.c}`}><div className="text-lg font-bold">{s.v}</div><div className="text-[9px] uppercase tracking-wider font-medium">{s.l}</div></div>)}</div></div> },
                ].map((a, idx) => <div key={idx} className="bg-white rounded-2xl border border-[#E5EAF2] overflow-hidden hover:shadow-lg hover:shadow-[#2563EB]/5 transition-all"><div className="p-6"><div className="flex items-center gap-3 mb-2"><span className="text-2xl">{a.emoji}</span><h3 className="font-bold text-[#1A2332]">{a.title}</h3></div><p className="text-sm text-[#7C8DB5] leading-relaxed">{a.desc}</p></div>{a.preview}</div>)}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ===== LIVE INTERACTIVE VIEW ===== */}
      {view === 'live' && (
        <div className="pt-20 pb-16 bg-[#F1F5F9] text-[#1E293B] min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
          


          <section className="py-8 px-6">
            <div className="max-w-7xl mx-auto">
              
              {/* Top Stats */}
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                 <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
                    <div>
                       <p className="text-[#64748B] text-[10px] font-bold uppercase tracking-wider mb-1">Confirmaciones por IA</p>
                       <div className="flex items-baseline gap-2">
                          <p className="text-3xl font-bold text-[#0F172A]">94%</p>
                          <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-medium">↑ 12%</span>
                       </div>
                    </div>
                    <div className="w-full bg-[#F1F5F9] h-1.5 rounded-full mt-3 overflow-hidden">
                       <div className="bg-blue-600 h-full w-[94%]" />
                    </div>
                 </div>
                 <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
                    <div>
                       <p className="text-[#64748B] text-[10px] font-bold uppercase tracking-wider mb-1">Turnos Recuperados</p>
                       <div className="flex items-baseline gap-2">
                          <p className="text-3xl font-bold text-[#0F172A]">8</p>
                          <span className="text-xs text-[#64748B]">hoy</span>
                       </div>
                    </div>
                    <p className="text-[10px] text-[#64748B] mt-2">Slots cancelados y re-ocupados automáticamente.</p>
                 </div>
                 <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
                    <div>
                       <p className="text-[#64748B] text-[10px] font-bold uppercase tracking-wider mb-1">Pre-Checkin Digital</p>
                       <div className="flex items-baseline gap-2">
                          <p className="text-3xl font-bold text-[#0F172A]">18/22</p>
                       </div>
                    </div>
                     <p className="text-[10px] text-[#64748B] mt-2">Pacientes con datos completos antes de llegar.</p>
                 </div>
                 <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-5 rounded-xl border border-blue-800 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                       <p className="text-blue-100 text-[10px] font-bold uppercase tracking-wider mb-1">Ahorro Administrativo</p>
                       <div className="flex items-baseline gap-2">
                          <p className="text-3xl font-bold">~4hs</p>
                       </div>
                       <p className="text-[10px] text-blue-100 mt-2">Tiempo ahorrado hoy en llamados.</p>
                    </div>
                    <div className="absolute -right-4 -bottom-4 text-8xl opacity-10">🤖</div>
                 </div>
               </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Intelligent Agenda */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col h-[500px]">
                       <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
                          <div>
                             <h3 className="font-bold text-[#0F172A]">Agenda Inteligente</h3>
                             <p className="text-xs text-[#64748B]">Gestión de turnos en tiempo real</p>
                          </div>
                          <div className="flex gap-2">
                             <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded">Autocompletar: ON</span>
                             <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">Lista Espera: ON</span>
                          </div>
                       </div>
                       <div className="flex-1 overflow-y-auto p-0">
                          <div className="relative">
                             {/* Timeline vertical line */}
                             <div className="absolute left-8 top-0 bottom-0 w-px bg-[#E2E8F0]" />
                             
                             {liveQueue.map((q, i) => (
                                <div key={i} className="relative pl-16 pr-5 py-4 hover:bg-[#F8FAFC] group transition-colors">
                                   <div className="absolute left-6 top-5 w-4 h-4 rounded-full border-2 border-white shadow-sm bg-blue-500 z-10" />
                                   <span className="absolute left-2 top-5 text-[10px] font-mono text-[#64748B] font-bold">{q.time}</span>
                                   
                                   <div className="flex justify-between items-start">
                                      <div>
                                         <div className="flex items-center gap-2 mb-0.5">
                                            <span className="font-bold text-[#0F172A] text-sm">{q.name}</span>
                                            {q.status === 'En consultorio' && <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded uppercase">En Atención</span>}
                                            {q.status === 'En espera' && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold rounded uppercase">En Sala</span>}
                                         </div>
                                         <p className="text-xs text-[#64748B]">{q.spec} con {q.doctor}</p>
                                      </div>
                                      <div className="text-right">
                                         {Math.random() > 0.5 ? (
                                            <div className="flex items-center gap-1 justify-end text-[10px] text-green-600 font-bold bg-green-50 px-2 py-1 rounded-full">
                                               <span>✓ Confirmado x WhatsApp</span>
                                            </div>
                                         ) : (
                                            <div className="flex items-center gap-1 justify-end text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-full">
                                               <span>⚡ Ocupó turno cancelado</span>
                                            </div>
                                         )}
                                      </div>
                                   </div>
                                </div>
                             ))}
                             {/* Future slots */}
                             {[1,2,3].map((_, i) => (
                                <div key={`fut${i}`} className="relative pl-16 pr-5 py-4 opacity-60">
                                   <div className="absolute left-6 top-5 w-4 h-4 rounded-full border-2 border-white shadow-sm bg-[#CBD5E1] z-10" />
                                   <span className="absolute left-2 top-5 text-[10px] font-mono text-[#94A3B8] font-bold">12:{15 + (i*15)}</span>
                                   <div className="h-4 w-48 bg-[#F1F5F9] rounded animate-pulse" />
                                </div>
                             ))}
                          </div>
                       </div>
                    </div>
                </div>

                {/* Right Column: AI Bot Monitor */}
                <div className="space-y-6">
                   <div className="bg-[#0F172A] rounded-xl border border-[#334155] shadow-lg flex flex-col h-[500px] overflow-hidden relative">
                      <div className="p-4 border-b border-[#334155] bg-[#1E293B] flex justify-between items-center">
                          <div className="flex items-center gap-2">
                             <span className="text-lg">🤖</span>
                             <div>
                                <h3 className="font-bold text-white text-sm">Bot de Turnos</h3>
                                <p className="text-[10px] text-blue-400">Activo • Procesando mensajes</p>
                             </div>
                          </div>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
                       </div>
                       
                       <div className="flex-1 p-4 space-y-4 overflow-y-auto font-mono text-xs">
                          {/* Chat Bubbles Simulation */}
                          <div className="opacity-50 text-center text-[10px] text-gray-500 my-4">--- Hoy ---</div>
                          
                          <div className="flex flex-col gap-1 animate-[slideIn_0.3s_ease-out]">
                             <div className="self-end bg-blue-600/20 border border-blue-500/30 text-blue-200 px-3 py-2 rounded-l-lg rounded-tr-lg max-w-[85%]">
                                Hola Carlos 👋 Te recordamos tu turno de Dermatólogia mañana 09:30hs. <br/>¿Confirmás asistencia?
                             </div>
                             <span className="text-[9px] text-gray-500 self-end mr-1">Enviado 10:45</span>
                          </div>

                          <div className="flex flex-col gap-1 animate-[slideIn_0.5s_ease-out]">
                             <div className="self-start bg-[#334155]/50 border border-[#475569]/50 text-gray-300 px-3 py-2 rounded-r-lg rounded-tl-lg max-w-[85%]">
                                Si, confirmo. Gracias.
                             </div>
                             <span className="text-[9px] text-gray-500 self-start ml-1">Recibido 10:52</span>
                          </div>

                           <div className="flex flex-col gap-1 animate-[slideIn_0.7s_ease-out]">
                             <div className="self-end bg-green-600/20 border border-green-500/30 text-green-200 px-3 py-2 rounded-l-lg rounded-tr-lg max-w-[85%]">
                                ¡Turno Confirmado! ✅ <br/> Recordá traer tu credencial de OSDE.
                             </div>
                             <span className="text-[9px] text-gray-500 self-end mr-1">Enviado 10:52</span>
                          </div>

                          {liveEvents.filter(e => e.type === 'booking' || e.type === 'cancel').map((e, i) => (
                             <div key={i} className="flex flex-col gap-1 animate-[slideIn_0.3s_ease-out]">
                                <div className="self-start bg-[#334155]/50 border border-[#475569]/50 text-gray-300 px-3 py-2 rounded-r-lg rounded-tl-lg max-w-[85%]">
                                   {e.type === 'booking' ? 'Hola, quiero sacar turno para Pediatría.' : 'Tengo que cancelar mi turno de hoy.'}
                                </div>
                                <div className="self-end bg-blue-600/20 border border-blue-500/30 text-blue-200 px-3 py-2 rounded-l-lg rounded-tr-lg max-w-[85%]">
                                   {e.type === 'booking' ? 'Entendido. Tengo disponible el Jueves 15 a las 10:00hs o 14:30hs. ¿Te sirve alguno?' : 'Lamento escuchar eso. ¿Querés reprogramar o dejamos el espacio libre?'}
                                </div>
                             </div>
                          ))}
                       </div>
                       
                       <div className="p-3 bg-[#1E293B] border-t border-[#334155] text-[10px] text-gray-400 flex justify-between">
                          <span>Conexión WhatsApp API: Estable</span>
                          <span>9ms latencia</span>
                       </div>
                   </div>
                </div>

              </div>
            </div>
          </section>

          <style>{`
             @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default ClinicDemoPage;
