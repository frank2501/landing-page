import React, { useState } from 'react';

type Tab = 'dashboard' | 'ventas' | 'stock' | 'mensajes' | 'config';

const DashboardMockup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'ventas', name: 'Ventas', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'stock', name: 'Stock', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { id: 'mensajes', name: 'Mensajes', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { id: 'config', name: 'Configuración', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  return (
    <div className="relative max-w-4xl mx-auto transform hover:scale-[1.01] transition-transform duration-700">
      <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 via-orange-500/20 to-blue-600/20 rounded-2xl blur-xl opacity-40" />
      
      <div className="relative bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[450px]">
        {/* Header */}
        <div className="flex items-center gap-4 px-4 py-3 border-b border-white/5 bg-white/5 shrink-0">
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
          </div>
          <div className="flex-1 text-center hidden md:block">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-white/5 text-[10px] md:text-xs text-gray-500 font-mono">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              app.artechia.com/{activeTab}
            </div>
          </div>
          <div className="w-16 hidden md:block" /> 
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-16 md:w-56 border-r border-white/5 bg-zinc-950/50 flex flex-col py-6 shrink-0 transition-all duration-300">
            <div className="px-6 mb-8 hidden md:block">
              <div className="h-6 w-32 bg-gradient-to-r from-orange-500/20 to-transparent rounded-full" />
            </div>
            
            <div className="space-y-1 px-2 md:px-4">
              {tabs.map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-orange-500/10 to-transparent text-white border-l-2 border-orange-500' 
                      : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
                  }`}
                >
                  <svg className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === tab.id ? 'text-orange-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
                  </svg>
                  <span className="hidden md:block text-sm font-medium text-left">{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-black/40 p-6 md:p-8 overflow-y-auto relative">
            
            {/* Dashboard View */}
            {activeTab === 'dashboard' && (
              <div className="animate-fade-in space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Centro de Automatización</h3>
                    <p className="text-sm text-gray-500">Gestioná tus bots y flujos de trabajo en tiempo real.</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold text-green-500 uppercase tracking-wide">Sistema Activo</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1 */}
                  <div className=" group p-5 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                      </div>
                      <div className="h-6 w-11 rounded-full bg-green-500/20 flex items-center justify-end px-1"><div className="w-4 h-4 rounded-full bg-green-500" /></div>
                    </div>
                    <div className="relative z-10">
                      <h4 className="text-base font-bold text-white mb-1">Respuestas IA</h4>
                      <p className="text-xs text-gray-400">Atención al cliente 24/7.</p>
                    </div>
                  </div>
                  {/* Card 2 */}
                  <div className="group p-5 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                        <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                      </div>
                      <div className="h-6 w-11 rounded-full bg-green-500/20 flex items-center justify-end px-1"><div className="w-4 h-4 rounded-full bg-green-500" /></div>
                    </div>
                    <div className="relative z-10">
                      <h4 className="text-base font-bold text-white mb-1">Sync de Stock</h4>
                      <p className="text-xs text-gray-400">Sincronización automática.</p>
                    </div>
                  </div>
                  {/* Card 3 */}
                  <div className="group p-5 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      </div>
                      <div className="h-6 w-11 rounded-full bg-green-500/20 flex items-center justify-end px-1"><div className="w-4 h-4 rounded-full bg-green-500" /></div>
                    </div>
                    <div className="relative z-10">
                      <h4 className="text-base font-bold text-white mb-1">Recupero de Carritos</h4>
                      <p className="text-xs text-gray-400">Emails automáticos a clientes.</p>
                    </div>
                  </div>
                  {/* Card 4 */}
                  <div className="group p-5 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                      </div>
                      <div className="h-6 w-11 rounded-full bg-green-500/20 flex items-center justify-end px-1"><div className="w-4 h-4 rounded-full bg-green-500" /></div>
                    </div>
                    <div className="relative z-10">
                      <h4 className="text-base font-bold text-white mb-1">Alertas WhatsApp</h4>
                      <p className="text-xs text-gray-400">Notificaciones instantáneas de negocio.</p>
                    </div>
                  </div>
                </div>

                {/* Floating Notification */}
                <div className="absolute bottom-6 right-6 bg-[#0F1115] border border-orange-500/30 shadow-2xl shadow-orange-500/5 px-4 py-3 rounded-xl flex items-center gap-3 z-20 backdrop-blur-md animate-bounce-custom max-w-xs">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Actividad Reciente</div>
                    <div className="text-xs font-medium text-white">Bot "Sync de Stock" actualizó 45 artículos.</div>
                  </div>
                </div>
              </div>
            )}

            {/* Ventas View */}
            {activeTab === 'ventas' && (
               <div className="animate-fade-in space-y-6">
                 <div>
                    <h3 className="text-xl font-bold text-white mb-1">Últimas Ventas</h3>
                    <p className="text-sm text-gray-500">Transacciones procesadas automáticamente.</p>
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 font-bold text-xs">$</div>
                          <div>
                            <div className="text-sm font-bold text-white">Orden #{2450 + i}</div>
                            <div className="text-[10px] text-gray-400">Hace {i * 5} minutos</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-white">$ {15000 * i}</div>
                          <div className="text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full inline-block">Procesado</div>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            )}

            {/* Stock View */}
             {activeTab === 'stock' && (
               <div className="animate-fade-in space-y-6">
                 <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Stock en Tiempo Real</h3>
                    <span className="text-xs text-orange-400 animate-pulse">● Sincronizando</span>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-white/5">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-white/5 text-gray-400 border-b border-white/5">
                        <tr>
                          <th className="px-4 py-3 font-medium">Producto</th>
                          <th className="px-4 py-3 font-medium text-right">Cant.</th>
                          <th className="px-4 py-3 font-medium text-right">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {[
                          { name: 'Auriculares Wireless', count: 45, status: 'OK' },
                          { name: 'Smart Watch Gen 4', count: 12, status: 'Low' },
                          { name: 'Teclado Mecánico', count: 89, status: 'OK' },
                          { name: 'Mouse Gamer RGB', count: 0, status: 'Sin Stock' }
                        ].map((item, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 text-white">{item.name}</td>
                            <td className="px-4 py-3 text-right text-gray-300 font-mono">{item.count}</td>
                            <td className="px-4 py-3 text-right">
                              <span className={`text-[10px] px-2 py-1 rounded-full ${item.count > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                {item.status === 'OK' ? 'Sincronizado' : item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
            )}

            {/* Messages View */}
            {activeTab === 'mensajes' && (
               <div className="animate-fade-in h-full flex flex-col">
                 <h3 className="text-xl font-bold text-white mb-4">Chatbot IA</h3>
                 <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                   <div className="flex justify-end">
                     <div className="bg-blue-600/20 text-blue-100 rounded-2xl rounded-tr-none py-2 px-4 text-sm max-w-[80%] border border-blue-500/20">
                       Hola, tenés stock de los auriculares?
                     </div>
                   </div>
                   <div className="flex justify-start">
                     <div className="bg-zinc-800 text-gray-200 rounded-2xl rounded-tl-none py-2 px-4 text-sm max-w-[80%] border border-white/10 shadow-lg">
                       <p>¡Hola! 👋 Sí, tenemos stock disponible de los Auriculares Wireless.</p>
                       <p className="mt-2 text-xs text-gray-500 border-t border-white/10 pt-2 flex items-center gap-1">
                         <svg className="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                         Respondido automáticamante por IA
                       </p>
                     </div>
                   </div>
                   <div className="flex justify-end">
                     <div className="bg-blue-600/20 text-blue-100 rounded-2xl rounded-tr-none py-2 px-4 text-sm max-w-[80%] border border-blue-500/20">
                       Genial, aceptan cuotas?
                     </div>
                   </div>
                   <div className="flex justify-start">
                      <div className="flex gap-2">
                         <div className="flex space-x-1 items-center bg-zinc-800 rounded-2xl rounded-tl-none py-3 px-4 border border-white/10">
                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                         </div>
                      </div>
                   </div>
                 </div>
               </div>
            )}

            {/* Config View */}
            {activeTab === 'config' && (
              <div className="animate-fade-in space-y-6">
                <h3 className="text-xl font-bold text-white mb-2">Integraciones</h3>
                <div className="space-y-4">
                  {[
                    {
                      name: 'TiendaNube', 
                      status: true, 
                      color: 'blue', 
                      icon: (
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
                        </svg>
                      ),
                    },
                    { 
                      name: 'MercadoPago', 
                      status: true, 
                      color: 'blue', 
                      icon: (
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                        </svg>
                      ) 
                    },
                    { 
                      name: 'WhatsApp Business', 
                      status: true, 
                      color: 'green', 
                      icon: (
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      ) 
                    },
                    { 
                      name: 'Google Sheets', 
                      status: false, 
                      color: 'green', 
                      icon: (
                        <svg className="w-6 h-6" viewBox="0 0 48 48" fill="currentColor">
                          <path fill="#43A047" d="M37,45H11c-1.657,0-3-1.343-3-3V6c0-1.657,1.343-3,3-3h19l10,10v29C40,43.657,38.657,45,37,45z"/>
                          <path fill="#C8E6C9" d="M40 13L30 13 30 3z"/>
                          <path fill="#2E7D32" d="M30 13L40 23 40 13z"/>
                          <path fill="#E8F5E9" d="M31,23H17h-2v2v2v2v2v2v2v2h18v-2v-2v-2v-2v-2v-2v-2H31z M17,25h14v2H17V25z M17,29h14v2H17V29z M17,33h14v2H17V33z M31,35v2H17v-2H31z"/>
                        </svg>
                      ) 
                    }
                  ].map((app, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${app.status ? `bg-${app.color}-500/20 text-${app.color}-400` : 'bg-gray-800 text-gray-500'}`}>
                          {app.icon}
                        </div>
                        <div className="flex flex-col justify-center min-w-0 flex-1">
                          <div className="text-sm font-bold text-white">{app.name}</div>
                          <div className="text-xs text-gray-500 font-medium">{app.status ? 'Conectado' : 'Desconectado'}</div>
                        </div>
                      </div>
                      <div className={`w-12 h-6 rounded-full p-1 transition-colors shrink-0 ${app.status ? 'bg-green-500' : 'bg-zinc-700'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${app.status ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMockup;
