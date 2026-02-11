import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

type ViewMode = 'site' | 'admin' | 'live';

const reviews = [
  { name: 'María Alejandra', time: 'hace 4 meses', rating: 5, text: 'Un lugar increíble. La vista al lago es espectacular y el desayuno excelente. Volvemos seguro.', initial: 'M', color: 'bg-emerald-600' },
  { name: 'Federico Molina', time: 'hace 8 meses', rating: 5, text: 'La atención es de primera. Las cabañas están impecables. Muy recomendable para descansar en pareja.', initial: 'F', color: 'bg-blue-600' },
  { name: 'Sandra López', time: 'hace 1 año', rating: 5, text: 'Excelente relación calidad-precio. El entorno natural es único y el personal super amable. 10/10', initial: 'S', color: 'bg-purple-600' },
];

const calendarDays = Array.from({ length: 28 }, (_, i) => ({
  day: i + 1,
  status: i < 3 ? 'past' : [4,5,6,12,13,14,20,21].includes(i+1) ? 'booked' : [7,8,15,16,22,23].includes(i+1) ? 'checkin' : 'available',
}));

// Live simulation data
const guestNames = ['María Gutiérrez', 'John Smith', 'Tomás Herrera', 'Laura Vidal', 'Pierre Dupont', 'Ana Belén', 'Carlos Ruiz', 'Sophie Martin', 'Roberto Paz', 'Elena Vargas'];
const roomNames = ['Clásica 101', 'Clásica 102', 'Superior 201', 'Superior 202', 'Suite Jr. 301', 'Suite Pres. 401'];
const platforms = ['Directo', 'Booking', 'Airbnb'];

const HotelDemoPage: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewMode>('site');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [dashTab, setDashTab] = useState<'reservas' | 'calendario'>('reservas');
  const [rooms, setRooms] = useState([
    { name: 'Habitación Clásica', price: 120, size: '25m²', guests: 2, amenities: ['WiFi', 'TV 50"', 'Minibar'], available: true, image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800' },
    { name: 'Suite Superior', price: 180, size: '40m²', guests: 3, amenities: ['Vista al Lago', 'King Size', 'Sofá'], available: true, image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800' },
    { name: 'Suite Junior', price: 250, size: '55m²', guests: 4, amenities: ['Balcón', 'Jacuzzi', 'Desayuno'], available: false, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800' },
    { name: 'Suite Presidencial', price: 400, size: '85m²', guests: 5, amenities: ['Piso Exclusivo', 'Mayordomo', 'Cena'], available: true, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800' },
  ]);

  // Live state
  const [liveEvents, setLiveEvents] = useState<Array<{ id: number; type: string; name: string; detail: string; time: string; icon: string }>>([]);
  const [liveOccupancy, setLiveOccupancy] = useState(7);
  const [liveTodayRevenue, setLiveTodayRevenue] = useState(285000);
  const [liveCheckinsToday, setLiveCheckinsToday] = useState(3);
  const [liveRoomStatuses, setLiveRoomStatuses] = useState([
    { room: 'Clásica 101', status: 'Ocupada', guest: 'J. Smith', color: 'bg-red-500' },
    { room: 'Clásica 102', status: 'Libre', guest: '-', color: 'bg-green-500' },
    { room: 'Superior 201', status: 'Ocupada', guest: 'M. Gutiérrez', color: 'bg-red-500' },
    { room: 'Superior 202', status: 'Limpieza', guest: '-', color: 'bg-amber-500' },
    { room: 'Suite Jr. 301', status: 'Ocupada', guest: 'L. Vidal', color: 'bg-red-500' },
    { room: 'Suite Pres. 401', status: 'Libre', guest: '-', color: 'bg-green-500' },
  ]);
  const [eventCounter, setEventCounter] = useState(0);

  const generateEvent = useCallback(() => {
    const name = guestNames[Math.floor(Math.random() * guestNames.length)];
    const room = roomNames[Math.floor(Math.random() * roomNames.length)];
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const types = [
      { type: 'reservation', detail: `nueva reserva vía ${platform} — ${room}`, icon: '📋' },
      { type: 'checkin', detail: `hizo check-in en ${room}`, icon: '🛎️' },
      { type: 'checkout', detail: `hizo check-out de ${room}`, icon: '👋' },
      { type: 'payment', detail: `pago acreditado — $${(Math.floor(Math.random() * 60 + 30) * 1000).toLocaleString()}`, icon: '💳' },
      { type: 'message', detail: `envió mensaje: "¿A qué hora es el desayuno?"`, icon: '💬' },
      { type: 'cleaning', detail: `limpieza completada en ${room}`, icon: '🧹' },
    ];
    const event = types[Math.floor(Math.random() * types.length)];
    const now = new Date();
    return { id: Date.now() + Math.random(), type: event.type, name, detail: event.detail, time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`, icon: event.icon };
  }, []);

  useEffect(() => {
    if (view !== 'live') return;
    const initial = Array.from({ length: 5 }, () => generateEvent());
    setLiveEvents(initial);
    const interval = setInterval(() => {
      const newEvent = generateEvent();
      setLiveEvents(prev => [newEvent, ...prev].slice(0, 15));
      setEventCounter(c => c + 1);
      if (newEvent.type === 'checkin') { setLiveOccupancy(o => Math.min(o + 1, 10)); setLiveCheckinsToday(c => c + 1); }
      else if (newEvent.type === 'checkout') setLiveOccupancy(o => Math.max(o - 1, 0));
      else if (newEvent.type === 'payment') setLiveTodayRevenue(r => r + Math.floor(Math.random() * 60 + 30) * 1000);
      if (Math.random() < 0.3) {
        setLiveRoomStatuses(prev => {
          const updated = [...prev];
          const idx = Math.floor(Math.random() * updated.length);
          const statuses = [
            { status: 'Ocupada', guest: guestNames[Math.floor(Math.random() * guestNames.length)].split(' ')[0][0] + '. ' + guestNames[Math.floor(Math.random() * guestNames.length)].split(' ')[1], color: 'bg-red-500' },
            { status: 'Libre', guest: '-', color: 'bg-green-500' },
            { status: 'Limpieza', guest: '-', color: 'bg-amber-500' },
          ];
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
          updated[idx] = { ...updated[idx], ...newStatus };
          return updated;
        });
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [view, generateEvent]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2A26]" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>

      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-lg border-b border-[#E8E2D8]">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#2D5A3D] flex items-center justify-center text-white text-sm font-bold" style={{ fontFamily: 'sans-serif' }}>PL</div>
            <span className="text-lg font-bold tracking-wide hidden sm:inline">Posada del Lago</span>
          </div>

          <div className="flex items-center gap-2" style={{ fontFamily: 'sans-serif' }}>
            <button onClick={() => setView('site')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === 'site' ? 'bg-[#2D5A3D] text-white' : 'text-[#8B7E6A] hover:text-[#2D2A26] hover:bg-[#F5F1EB]'}`}>
              🌐 Sitio Web
            </button>
            <button onClick={() => setView('admin')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === 'admin' ? 'bg-orange-500 text-white' : 'text-[#8B7E6A] hover:text-[#2D2A26] hover:bg-[#F5F1EB]'}`}>
              ⚙️ Panel Admin
            </button>
            <button onClick={() => setView('live')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${view === 'live' ? 'bg-green-600 text-white' : 'text-[#8B7E6A] hover:text-[#2D2A26] hover:bg-[#F5F1EB]'}`}>
              {view === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              📡 Ver Versión Interactiva
            </button>
            <div className="w-px h-5 bg-[#E8E2D8] mx-1 hidden sm:block" />
            <button onClick={() => navigate('/demos')} className="text-[10px] text-[#8B7E6A] hover:text-[#2D5A3D] transition-colors border border-[#D4CFC5] px-2 py-1 rounded hidden sm:block">← Volver a Demos</button>
          </div>
        </div>
      </nav>

      {/* ===== MAIN SITE VIEW ===== */}
      {view === 'site' && (
        <>
          {/* Hero */}
          <section className="relative pt-28 pb-16 md:pt-40 md:pb-28 px-6 bg-gradient-to-b from-[#2D5A3D]/5 to-transparent">
            <div className="max-w-5xl mx-auto text-center">
              <p className="text-[#8B7E6A] text-xs uppercase tracking-[0.4em] mb-4" style={{ fontFamily: 'sans-serif' }}>Bienvenidos a</p>
              <h1 className="text-5xl md:text-8xl font-bold text-[#2D2A26] leading-[0.95] tracking-tight mb-4">Posada del Lago</h1>
              <p className="text-lg md:text-2xl text-[#8B7E6A] mb-3 italic">Donde la naturaleza te abraza.</p>
              <p className="max-w-md mx-auto text-sm text-[#A09888] mb-10 leading-relaxed" style={{ fontFamily: 'sans-serif' }}>Un refugio exclusivo a orillas del lago Nahuel Huapi. Reservá directo, sin intermediarios.</p>
              <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl shadow-black/5 border border-[#E8E2D8] p-2" style={{ fontFamily: 'sans-serif' }}>
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 px-4 py-3 text-left"><label className="text-[9px] text-[#8B7E6A] uppercase tracking-wider font-semibold block mb-1">Check-in</label><input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full text-sm text-[#2D2A26] bg-transparent outline-none" /></div>
                  <div className="hidden md:block w-px bg-[#E8E2D8]" />
                  <div className="flex-1 px-4 py-3 text-left"><label className="text-[9px] text-[#8B7E6A] uppercase tracking-wider font-semibold block mb-1">Check-out</label><input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full text-sm text-[#2D2A26] bg-transparent outline-none" /></div>
                  <div className="hidden md:block w-px bg-[#E8E2D8]" />
                  <div className="flex-1 px-4 py-3 text-left"><label className="text-[9px] text-[#8B7E6A] uppercase tracking-wider font-semibold block mb-1">Huéspedes</label><select value={guests} onChange={(e) => setGuests(e.target.value)} className="w-full text-sm text-[#2D2A26] bg-transparent outline-none"><option>1</option><option>2</option><option>3</option><option>4</option></select></div>
                  <button className="px-8 py-3 bg-[#2D5A3D] text-white rounded-xl text-sm font-semibold hover:bg-[#1e4a2e] transition-all active:scale-95">Buscar</button>
                </div>
              </div>
            </div>
          </section>

          {/* Habitaciones */}
          <section id="habitaciones" className="py-16 md:py-24 px-6 scroll-mt-20 animate-fade-up">
            <div className="max-w-5xl mx-auto">
              <div className="mb-12"><p className="text-[#2D5A3D] text-xs uppercase tracking-[0.3em] font-semibold mb-2" style={{ fontFamily: 'sans-serif' }}>Nuestras Habitaciones</p><h2 className="text-3xl md:text-5xl font-bold tracking-tight">Elegí tu estadía ideal</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {rooms.map((room) => (
                  <div key={room.name} className={`group bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-xl ${room.available ? 'border-[#E8E2D8] hover:shadow-[#2D5A3D]/10' : 'border-[#E8E2D8] opacity-80 grayscale'}`}>
                    <div className="h-56 relative overflow-hidden">
                       <img src={room.image} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                       {!room.available && <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"><span className="px-4 py-2 bg-white/90 text-red-500 font-bold text-xs rounded-full uppercase tracking-wider">Agotada</span></div>}
                    </div>
                    <div className="p-6" style={{ fontFamily: 'sans-serif' }}>
                      <div className="flex items-start justify-between mb-3"><div><h3 className="font-bold text-xl text-[#2D2A26] mb-1" style={{ fontFamily: 'Georgia, serif' }}>{room.name}</h3><p className="text-xs text-[#8B7E6A] font-medium">{room.size} · Hasta {room.guests} huéspedes</p></div></div>
                      <div className="flex flex-wrap gap-2 mb-6">{room.amenities.map((a, i) => <span key={i} className="text-[10px] px-2.5 py-1 rounded-full bg-[#F5F1EB] text-[#6B6259] font-bold tracking-wide">{a}</span>)}</div>
                      <div className="flex items-center justify-between pt-4 border-t border-[#F5F1EB]"><div><span className="text-2xl font-bold text-[#2D2A26]">${room.price}</span><span className="text-xs text-[#8B7E6A] ml-1">/noche</span></div><button disabled={!room.available} className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${room.available ? 'bg-[#2D5A3D] text-white hover:bg-[#1e4a2e] active:scale-95 shadow-lg shadow-[#2D5A3D]/20' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>{room.available ? 'Reservar' : 'No disponible'}</button></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Amenities */}
          <section className="py-16 md:py-24 px-6 bg-[#FDFBF7] border-y border-[#E8E2D8] animate-fade-up">
             <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                   <div style={{ fontFamily: 'sans-serif' }}>
                      <p className="text-[#2D5A3D] text-xs uppercase tracking-[0.3em] font-semibold mb-2">Servicios Exclusivos</p>
                      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#2D2A26]">Todo lo que necesitás</h2>
                   </div>
                   <button className="px-6 py-3 rounded-lg border border-[#D4CFC5] text-xs font-semibold text-[#8B7E6A] hover:bg-white transition-all">Ver todos los servicios</button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                   {[
                      { icon: '🏊‍♂️', title: 'Piscina Climatizada', desc: 'Con vista al lago.' },
                      { icon: '💆‍♀️', title: 'Spa & Wellness', desc: 'Masajes y sauna seco.' },
                      { icon: '🍷', title: 'Cava de Vinos', desc: 'Selección patagónica.' },
                      { icon: '🚗', title: 'Estacionamiento', desc: 'Privado y cubierto.' },
                      { icon: '📶', title: 'High-Speed WiFi', desc: 'Starlink en todo el predio.' },
                      { icon: '🔥', title: 'Fogonero', desc: 'Noches de encuentro.' },
                      { icon: '🧸', title: 'Kids Club', desc: 'Actividades recreativas.' },
                      { icon: '🛎️', title: 'Concierge 24hs', desc: 'Atención personalizada.' }
                   ].map((item, i) => (
                      <div key={i} className="flex gap-4 items-start group">
                         <div className="w-12 h-12 rounded-full bg-[#2D5A3D]/5 flex items-center justify-center text-2xl group-hover:bg-[#2D5A3D] group-hover:text-white transition-colors duration-300">{item.icon}</div>
                         <div>
                            <h3 className="font-bold text-[#2D2A26] mb-1" style={{ fontFamily: 'Georgia, serif' }}>{item.title}</h3>
                            <p className="text-sm text-[#8B7E6A]" style={{ fontFamily: 'sans-serif' }}>{item.desc}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </section>

          {/* Experiencia */}
          <section className="py-16 md:py-24 px-6 bg-[#F5F1EB] animate-fade-up">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-10">Una experiencia única</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ fontFamily: 'sans-serif' }}>
                {[
                  { img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=500', title: 'Vista al lago', desc: 'Panorámica al Nahuel Huapi' },
                  { img: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&q=80&w=500', title: 'Desayuno casero', desc: 'Productos regionales' },
                  { img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=500', title: 'Excursiones', desc: 'Kayak, trekking, cabalgata' },
                  { img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=500', title: 'Spa & Relax', desc: 'Sauna y jacuzzi exterior' }
                ].map((exp, i) => (
                  <div key={i} className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all">
                     <img src={exp.img} alt={exp.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                     <div className="absolute bottom-0 left-0 p-5 text-left">
                        <h3 className="font-bold text-white text-lg mb-1 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>{exp.title}</h3>
                        <p className="text-[11px] text-gray-300 font-medium">{exp.desc}</p>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Reseñas */}
          <section id="resenas" className="py-16 md:py-24 px-6 scroll-mt-20 animate-fade-up">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-14" style={{ fontFamily: 'sans-serif' }}>
                <div className="shrink-0 text-center md:text-left">
                  <p className="text-sm text-[#8B7E6A] font-bold uppercase tracking-wider mb-1">Excelente</p>
                  <div className="flex items-center gap-0.5 mb-1 justify-center md:justify-start">{[1,2,3,4,5].map(i => <svg key={i} className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}</div>
                  <p className="text-xs text-[#8B7E6A] mb-2">A base de <span className="font-bold text-[#2D2A26]">73 reseñas</span></p>
                  <div className="text-xs text-[#A09888] font-bold">Google</div>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {reviews.map((r, i) => (
                    <div key={i} className="bg-white rounded-xl p-5 border border-[#E8E2D8] shadow-sm">
                      <div className="flex items-center gap-3 mb-3"><div className={`w-9 h-9 rounded-full ${r.color} flex items-center justify-center text-white text-sm font-bold`}>{r.initial}</div><div className="flex-1 min-w-0"><div className="text-sm font-bold text-[#2D2A26] truncate">{r.name}</div><div className="text-[10px] text-[#8B7E6A]">{r.time}</div></div></div>
                      <div className="flex items-center gap-0.5 mb-2">{Array.from({ length: r.rating }).map((_, j) => <svg key={j} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}</div>
                      <p className="text-xs text-[#6B6259] leading-relaxed">{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* CTA + Footer */}
          <section className="py-16 md:py-24 px-6 bg-[#2D5A3D]"><div className="max-w-2xl mx-auto text-center"><h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">Tu próxima escapada te espera</h2><p className="text-[#A3C9B0] text-base mb-8" style={{ fontFamily: 'sans-serif' }}>Reservá directo y obtené el mejor precio garantizado.</p><a href="#habitaciones" className="inline-block px-10 py-4 bg-white text-[#2D5A3D] font-bold rounded-xl hover:bg-[#F5F1EB] transition-all active:scale-95" style={{ fontFamily: 'sans-serif' }}>Ver Habitaciones</a></div></section>

          <footer className="border-t border-[#E8E2D8] py-10 px-6 bg-[#FDFBF7]" style={{ fontFamily: 'sans-serif' }}>
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3"><div className="w-7 h-7 rounded-full bg-[#2D5A3D] flex items-center justify-center text-white text-[9px] font-bold">PL</div><span className="text-sm font-bold text-[#2D2A26]" style={{ fontFamily: 'Georgia, serif' }}>Posada del Lago</span></div>
              <div className="flex items-center gap-3">{[
                <svg key="ig" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
                <svg key="fb" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
                <svg key="wa" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a.96.96 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>,
              ].map((icon, i) => <a key={i} href="#" className="w-9 h-9 rounded-full bg-[#2D5A3D]/5 border border-[#E8E2D8] flex items-center justify-center text-[#8B7E6A] hover:text-[#2D5A3D] hover:border-[#2D5A3D]/30 transition-all">{icon}</a>)}</div>
              <div className="text-xs text-[#8B7E6A]">📍 Ruta 40, Villa La Angostura · 📞 294 449-XXXX</div>
            </div>
            <div className="max-w-5xl mx-auto mt-6 pt-4 border-t border-[#E8E2D8] flex flex-col md:flex-row items-center justify-between gap-2">
              <p className="text-[10px] text-[#C4BCAE]">© 2026 Posada del Lago. Todos los derechos reservados.</p>
              <p className="text-[10px] text-[#C4BCAE]">Demo creada por <button onClick={() => navigate('/')} className="text-[#2D5A3D]/50 hover:text-[#2D5A3D] transition-colors">ArtechIA</button></p>
            </div>
          </footer>
        </>
      )}

      {/* ===== ADMIN VIEW ===== */}
      {view === 'admin' && (
        <div className="pt-20 pb-16 bg-[#F5F1EB] min-h-screen" style={{ fontFamily: 'sans-serif' }}>
          <section className="py-10 md:py-16 px-6">
            <div className="max-w-5xl mx-auto">
              <div className="mb-10"><p className="text-orange-600 text-xs font-bold uppercase tracking-widest mb-2">Panel de Gestión</p><h2 className="text-2xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>Reservas y Calendario</h2></div>
              <div className="bg-white rounded-2xl border border-[#E8E2D8] overflow-hidden shadow-lg shadow-black/[0.03]">
                <div className="flex border-b border-[#E8E2D8]"><button onClick={() => setDashTab('reservas')} className={`flex-1 py-4 text-sm font-semibold transition-all ${dashTab === 'reservas' ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50' : 'text-[#8B7E6A] hover:text-[#2D2A26]'}`}>📋 Reservas</button><button onClick={() => setDashTab('calendario')} className={`flex-1 py-4 text-sm font-semibold transition-all ${dashTab === 'calendario' ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50' : 'text-[#8B7E6A] hover:text-[#2D2A26]'}`}>📅 Calendario</button></div>
                {dashTab === 'reservas' && (
                  <div className="p-5 md:p-6 overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-[#8B7E6A] text-xs uppercase tracking-wider"><th className="text-left pb-4 font-medium">Huésped</th><th className="text-left pb-4 font-medium">Habitación</th><th className="text-left pb-4 font-medium">Fechas</th><th className="text-left pb-4 font-medium">Origen</th><th className="text-right pb-4 font-medium">Estado</th></tr></thead><tbody className="divide-y divide-[#F5F1EB]">{[{ guest: 'María Gutiérrez', room: 'Suite Junior', dates: '14-17 Feb', origin: 'Directo', status: 'Confirmada', initials: 'MG' }, { guest: 'John Smith', room: 'Superior Vista', dates: '15-20 Feb', origin: 'Booking', status: 'Confirmada', initials: 'JS' }, { guest: 'Tomás Herrera', room: 'Clásica', dates: '18-19 Feb', origin: 'Airbnb', status: 'Pendiente', initials: 'TH' }, { guest: 'Laura Vidal', room: 'Suite Presidencial', dates: '22-27 Feb', origin: 'Directo', status: 'Señada', initials: 'LV' }].map((r, i) => (<tr key={i} className="hover:bg-[#FDFBF7] transition-colors"><td className="py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-[11px] font-bold text-orange-700">{r.initials}</div><span className="font-medium text-[#2D2A26]">{r.guest}</span></div></td><td className="py-4 text-[#6B6259]">{r.room}</td><td className="py-4 text-[#8B7E6A] text-xs font-mono">{r.dates}</td><td className="py-4"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.origin === 'Directo' ? 'bg-[#2D5A3D]/10 text-[#2D5A3D]' : r.origin === 'Booking' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-500'}`}>{r.origin}</span></td><td className="py-4 text-right"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${r.status === 'Confirmada' ? 'bg-green-50 text-green-600' : r.status === 'Pendiente' ? 'bg-amber-50 text-amber-600' : 'bg-purple-50 text-purple-600'}`}>{r.status}</span></td></tr>))}</tbody></table></div>
                )}
                {dashTab === 'calendario' && (
                  <div className="p-5 md:p-6"><div className="text-center mb-4"><h3 className="text-lg font-bold text-[#2D2A26]" style={{ fontFamily: 'Georgia, serif' }}>Febrero 2026</h3></div><div className="grid grid-cols-7 gap-1.5 mb-2">{['Lu','Ma','Mi','Ju','Vi','Sá','Do'].map(d => <div key={d} className="text-center text-[10px] text-[#8B7E6A] font-semibold uppercase py-2">{d}</div>)}</div><div className="grid grid-cols-7 gap-1.5">{calendarDays.map(d => <div key={d.day} className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${d.status === 'past' ? 'text-[#C4BCAE]' : d.status === 'booked' ? 'bg-red-50 text-red-400 line-through' : d.status === 'checkin' ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-200' : 'bg-[#2D5A3D]/5 text-[#2D5A3D] hover:bg-[#2D5A3D]/10 cursor-pointer'}`}>{d.day}</div>)}</div></div>
                )}
              </div>
            </div>
          </section>

          {/* Automations */}
          <section className="py-10 md:py-16 px-6 border-t border-[#E8E2D8]">
            <div className="max-w-5xl mx-auto">
              <div className="mb-10"><p className="text-orange-600 text-xs font-bold uppercase tracking-widest mb-2">Automatizaciones</p><h2 className="text-2xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>Todo se gestiona solo</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { emoji: '📧', title: 'Email Post-Checkout', desc: 'Email de agradecimiento + pedido de reseña en Google.', preview: <div className="bg-white rounded-xl p-4 border border-[#E8E2D8] text-xs"><div className="text-[#2D5A3D] font-bold mb-1">¡Gracias por tu estadía, María! 🌿</div><p className="text-[#8B7E6A] leading-relaxed">Esperamos que hayas disfrutado. <span className="text-[#2D5A3D] underline">Dejar reseña →</span></p></div> },
                  { emoji: '✈️', title: 'Info Pre-Llegada', desc: 'WhatsApp 48hs antes del check-in.', preview: <div className="bg-white rounded-xl p-3 border border-green-100 text-xs text-[#4B5E4F] leading-relaxed">¡Hola María! Te esperamos el 14/02. Check-in: 14:00hs. 📍 Ruta 40, Villa La Angostura. ¿Transfer? 🚗</div> },
                  { emoji: '🧹', title: 'Alertas de Limpieza', desc: 'Notificación al housekeeping tras checkout.', preview: <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-amber-100"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-sm">🛏️</div><div><div className="text-xs font-bold text-[#2D2A26]">Suite Jr. - Hab. 301</div><div className="text-[10px] text-[#8B7E6A]">Checkout hoy 11:00</div></div></div><span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full">Pendiente</span></div> },
                  { emoji: '🔄', title: 'Sync Multi-Plataforma', desc: 'Booking, Airbnb y Web sincronizadas.', preview: <div className="flex items-center justify-around">{[{n:'Booking',c:'text-blue-600'},{n:'Airbnb',c:'text-rose-500'},{n:'Directo',c:'text-[#2D5A3D]'}].map((p,i) => <div key={i} className="text-center"><div className={`text-sm font-bold ${p.c}`}>{p.n}</div><div className="text-[9px] text-green-600 mt-0.5">● Sync</div></div>)}</div> },
                ].map((a, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-[#E8E2D8] overflow-hidden hover:shadow-lg hover:shadow-black/5 transition-all"><div className="p-6"><div className="flex items-center gap-3 mb-2"><span className="text-2xl">{a.emoji}</span><h3 className="font-bold text-[#2D2A26]">{a.title}</h3></div><p className="text-sm text-[#8B7E6A] leading-relaxed">{a.desc}</p></div><div className="bg-[#F9F7F3] border-t border-[#E8E2D8] p-4">{a.preview}</div></div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ===== LIVE INTERACTIVE VIEW ===== */}
      {view === 'live' && (
        <div className="pt-20 pb-16 bg-[#F5F2EB] text-[#2D2A26] min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
          


          <section className="py-10 px-6">
            <div className="max-w-7xl mx-auto">
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                {/* Occupancy Card */}
                <div className="bg-white rounded-xl p-6 border border-[#E8E2D8] shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-5 text-8xl text-[#2D5A3D]">🏨</div>
                   <p className="text-[#8B7E6A] text-xs font-bold uppercase tracking-widest mb-1">Ocupación Actual</p>
                   <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-serif font-bold text-[#2D2A26]">{liveOccupancy}0%</span>
                      <span className="text-sm text-green-600 font-medium">↑ 5% vs ayer</span>
                   </div>
                   <div className="w-full bg-[#F5F1EB] rounded-full h-1.5 mt-4">
                      <div className="bg-[#2D5A3D] h-1.5 rounded-full transition-all duration-1000" style={{ width: `${liveOccupancy}0%` }} />
                   </div>
                </div>

                {/* Check-ins Card */}
                <div className="bg-white rounded-xl p-6 border border-[#E8E2D8] shadow-sm flex flex-col justify-between">
                   <div>
                      <p className="text-[#8B7E6A] text-xs font-bold uppercase tracking-widest mb-1">Check-ins Pendientes</p>
                      <span className="text-4xl font-serif font-bold text-[#2D2A26]">3</span>
                   </div>
                   <div className="flex -space-x-2 mt-2">
                      {['M', 'J', 'L'].map((l, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-[#F5F1EB] border-2 border-white flex items-center justify-center text-xs font-bold text-[#8B7E6A]">{l}</div>
                      ))}
                      <div className="w-8 h-8 rounded-full bg-[#2D5A3D] border-2 border-white flex items-center justify-center text-xs font-bold text-white">+2</div>
                   </div>
                </div>

                {/* Housekeeping Card */}
                <div className="bg-white rounded-xl p-6 border border-[#E8E2D8] shadow-sm">
                   <p className="text-[#8B7E6A] text-xs font-bold uppercase tracking-widest mb-3">Housekeeping</p>
                   <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span className="font-medium text-[#2D2A26]">Hab. 102</span><span className="text-amber-500 font-bold">En proceso</span></div>
                        <div className="w-full bg-[#F5F1EB] rounded-full h-1"><div className="bg-amber-400 h-1 rounded-full w-[60%] animate-[shimmer_2s_infinite]" /></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span className="font-medium text-[#2D2A26]">Hab. 202</span><span className="text-[#8B7E6A]">Pendiente</span></div>
                        <div className="w-full bg-[#F5F1EB] rounded-full h-1"><div className="bg-[#E8E2D8] h-1 rounded-full w-0" /></div>
                      </div>
                   </div>
                </div>

                {/* Revenue Card */}
                 <div className="bg-[#2D5A3D] rounded-xl p-6 text-white shadow-lg shadow-[#2D5A3D]/20 relative overflow-hidden">
                    <div className="relative z-10">
                      <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">RevPAR (Hoy)</p>
                      <span className="text-4xl font-serif font-bold">${(liveTodayRevenue/1000).toFixed(0)}k</span>
                      <p className="text-xs text-white/80 mt-2">Promedio por habitación disponible</p>
                    </div>
                    <div className="absolute -bottom-6 -right-6 text-9xl text-white/10">💰</div>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visual Room Grid */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-[#E8E2D8] p-6 h-[520px] overflow-hidden flex flex-col">
                   <h3 className="font-serif font-bold text-xl text-[#2D2A26] mb-4">Estado de Habitaciones</h3>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3 overflow-y-auto pr-2">
                      {liveRoomStatuses.map((room, i) => (
                        <div key={i} className={`p-4 rounded-lg border transition-all ${room.status === 'Ocupada' ? 'bg-[#F9F7F3] border-[#E8E2D8]' : room.status === 'Libre' ? 'bg-white border-[#E8E2D8] hover:border-[#2D5A3D]/30' : 'bg-amber-50 border-amber-100'}`}>
                           <div className="flex justify-between items-start mb-2">
                              <span className="font-bold text-sm text-[#2D2A26]">{room.room}</span>
                              <span className="text-lg">{room.status === 'Ocupada' ? '🧳' : room.status === 'Libre' ? '✨' : '🧹'}</span>
                           </div>
                           <div className="text-xs">
                              {room.status === 'Ocupada' ? (
                                <>
                                  <p className="text-[#2D5A3D] font-medium">{room.guest}</p>
                                  <p className="text-[#8B7E6A] text-[10px] mt-0.5">Checkout: Mañana</p>
                                </>
                              ) : room.status === 'Libre' ? (
                                <p className="text-[#8B7E6A] text-[10px]">Lista para check-in</p>
                              ) : (
                                <p className="text-amber-600 font-medium text-[10px]">Limpieza en curso</p>
                              )}
                           </div>
                        </div>
                      ))}
                      {/* Fake extra rooms to fill grid */}
                      <div className="p-4 rounded-lg border border-[#E8E2D8] bg-[#F9F7F3] opacity-60"><span className="font-bold text-sm text-[#2D2A26]">Suite 402</span><p className="text-[10px] mt-2 text-[#8B7E6A]">Bloqueada (Mantenimiento)</p></div>
                   </div>
                </div>

                {/* Guest Requests Feed */}
                <div className="bg-white rounded-xl border border-[#E8E2D8] flex flex-col h-[520px] overflow-hidden">
                   <div className="p-5 border-b border-[#E8E2D8] bg-[#FDFBF7]">
                      <h3 className="font-serif font-bold text-lg text-[#2D2A26]">Solicitudes de Huéspedes</h3>
                      <p className="text-xs text-[#8B7E6A]">Concierge digital en tiempo real</p>
                   </div>
                   <div className="flex-1 overflow-y-auto p-0">
                      {liveEvents.filter(e => e.type !== 'payment').map((e, i) => (
                         <div key={e.id} className="p-4 border-b border-[#F5F1EB] hover:bg-[#F9F7F3] transition-colors flex gap-3 animate-[fadeIn_0.5s_ease-out]">
                            <div className="w-10 h-10 rounded-full bg-[#2D5A3D]/5 flex items-center justify-center text lg shrink-0">{e.type === 'message' ? '💬' : e.type === 'reservation' ? '📅' : '🛎️'}</div>
                            <div>
                               <p className="text-sm text-[#2D2A26] font-medium leading-tight">{e.detail}</p>
                               <div className="flex gap-2 mt-1.5 align-center">
                                  <span className="text-[10px] text-[#8B7E6A] uppercase tracking-wide font-bold">{e.name}</span>
                                  <span className="text-[10px] text-[#C4BCAE]">• {e.time}</span>
                               </div>
                            </div>
                         </div>
                      ))}
                      {[1,2,3].map(i => (
                         <div key={i} className="p-4 border-b border-[#F5F1EB] opacity-50 flex gap-3 grayscale">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">🍽️</div>
                            <div><p className="text-sm text-[#2D2A26]">Room Service: Club Sandwich</p><span className="text-[10px] text-[#8B7E6A]">Hab. 201 • Hace 25m</span></div>
                         </div>
                      ))}
                   </div>
                   <div className="p-4 bg-[#FDFBF7] border-t border-[#E8E2D8]">
                      <button className="w-full py-2.5 rounded-lg border border-[#D4CFC5] text-xs font-bold text-[#8B7E6A] hover:bg-white hover:text-[#2D5A3D] hover:border-[#2D5A3D] transition-all">Ver todas las solicitudes</button>
                   </div>
                </div>

              </div>
            </div>
          </section>
          
          <style>{`
            @keyframes shimmer { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default HotelDemoPage;
