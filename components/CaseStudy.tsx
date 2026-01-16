import React from 'react';

const CaseStudy: React.FC = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-full h-96 bg-orange-500/5 blur-[100px] -z-10" />
      
      <div className="max-w-5xl mx-auto">
        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 md:p-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-orange-500 font-bold mb-4 text-sm tracking-widest uppercase">Casos de uso reales</div>
              <h2 className="text-4xl font-bold mb-6 leading-tight">
                Sistemas que trabajan por vos
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Ya sea que vendas ropa, ofrezcas servicios o gestiones alojamientos, la automatización te devuelve el control de tu tiempo.
              </p>
              <div className="space-y-4">
                {[
                  "Actualización de disponibilidad automática",
                  "Sincronización de precios con proveedores",
                  "Alertas de nuevas reservas o pedidos",
                  "Carga automática de listas y catálogos"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => window.open('https://wa.me/5491137758970?text=Hola%2C%20tengo%20un%20negocio%20y%20quiero%20saber%20c%C3%B3mo%20automatizar%20tareas%20para%20ahorrar%20tiempo%20y%20evitar%20errores.', '_blank')}
                className="mt-8 px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-white/5 flex items-center gap-2 group"
              >
                <span>Consultar WhatsApp</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
            
            <div className="relative">
              <div className="bg-black p-6 rounded-2xl border border-white/10 shadow-2xl rotate-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-4.835 0-8.75 3.915-8.75 8.75s3.915 8.75 8.75 8.75 8.75-3.915 8.75-8.75-3.915-8.75-8.75-8.75zm.046 15.688c-3.832 0-6.953-3.121-6.953-6.953 0-3.832 3.121-6.953 6.953-6.953 3.832 0 6.953 3.121 6.953 6.953 0 3.832-3.121 6.953-6.953 6.953z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-bold">Asistente Virtual</div>
                    <div className="text-xs text-gray-500 italic">Enviado hace 5 min</div>
                  </div>
                </div>
                
                {/* Message Box 1 */}
                <div className="bg-zinc-800/50 p-4 rounded-xl text-sm border-l-4 border-orange-500 mb-4 transition-all duration-300 hover:translate-x-2 hover:bg-zinc-800 hover:shadow-[0_0_15px_rgba(249,115,22,0.1)] cursor-default">
                  <span className="font-bold text-orange-400">Detección:</span> Hola! Se detectó que el Alojamiento 4 fue reservado por otro medio. Ya pausé la fecha en tu web para evitar el doble alquiler.
                </div>
                
                {/* Message Box 2 */}
                <div className="bg-zinc-800/50 p-4 rounded-xl text-sm border-l-4 border-green-500 mb-4 transition-all duration-300 hover:translate-x-2 hover:bg-zinc-800 hover:shadow-[0_0_15px_rgba(34,197,94,0.1)] cursor-default">
                  <span className="font-bold text-green-400">Aviso:</span> Tu proveedor actualizó la lista de precios de servicios. El sistema ya ajustó tus tarifas un 15% automáticamente.
                </div>

                {/* Message Box 3 */}
                <div className="bg-zinc-800/50 p-4 rounded-xl text-sm border-l-4 border-blue-500 transition-all duration-300 hover:translate-x-2 hover:bg-zinc-800 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] cursor-default">
                  <span className="font-bold text-blue-400">Alerta:</span> Se detectó cambio de stock en proveedor. Ya se actualizó automáticamente la web de TiendaNube con las nuevas cantidades.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudy;