import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Sale {
  id: string;
  clientName: string;
  concept: string;
  amount: number;
  hasSubscription: boolean;
  subscriptionAmount?: number;
  createdAt: string;
}

const CheckoutPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSale = async () => {
      if (!id) return;
      
      try {
        const docRef = doc(db, "sales", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setSale({ id: docSnap.id, ...docSnap.data() } as Sale);
        } else {
          setSale(null);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSale();
  }, [id]);

  const [payLoading, setPayLoading] = useState(false);

  const handleMercadoPago = async () => {
    if (!sale) return;
    setPayLoading(true);

    try {
      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: sale.concept,
          unit_price: sale.amount,
          quantity: 1,
          id: sale.id,
        }),
      });

      const data = await response.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert('Error al generar el pago. Intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión. Intenta de nuevo.');
    } finally {
      setPayLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
        <h1 className="text-3xl font-bold mb-4">Link no encontrado</h1>
        <p className="text-gray-400 mb-8">El link de pago que buscas no existe o ha expirado.</p>
        <Link to="/" className="px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-orange-500 hover:text-white transition-colors">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-black text-white font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 text-orange-500 mb-6 border border-orange-500/20">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Resumen de Pago</h1>
          <p className="text-gray-400 text-lg">Hola <span className="text-white font-medium">{sale.clientName}</span>, este es el detalle de tu servicio.</p>
        </div>

        <div className="premium-border p-8 rounded-3xl bg-zinc-900/50 backdrop-blur-sm mb-8">
          <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-6">
            <span className="text-gray-400">Concepto</span>
            <span className="font-medium text-lg text-white">{sale.concept}</span>
          </div>
          
          <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-6">
            <span className="text-gray-400">Monto Único</span>
            <span className="font-bold text-2xl text-orange-400">${sale.amount.toLocaleString('es-AR')}</span>
          </div>

          {sale.hasSubscription && (
             <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-6">
              <span className="text-gray-400">Suscripción Mensual</span>
              <span className="font-bold text-xl text-white">${sale.subscriptionAmount?.toLocaleString('es-AR')}/mes</span>
            </div>
          )}

          <div className="pt-2 space-y-4">
            <button 
              onClick={handleMercadoPago}
              disabled={payLoading}
              className="w-full bg-[#009EE3] hover:bg-[#008ED0] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#009EE3]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {payLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.54 12.01l-1.67-.5c-.86-.26-1.18-.47-1.18-.94 0-.48.51-.77 1.34-.77.94 0 1.5.37 2.14 1.14l1.4-1.4c-.95-1.1-2.06-1.57-3.54-1.57v-2h-2v2c-1.8 0-3.23 1.13-3.23 2.76 0 1.8 1.48 2.37 2.65 2.73 1.05.32 1.33.56 1.33 1.05 0 .58-.69.87-1.53.87-1.03 0-1.74-.48-2.45-1.3l-1.42 1.4c1.1 1.25 2.45 1.76 3.87 1.76v2h2v-2c1.9 0 3.33-1.18 3.33-2.83 0-1.6-1.1-2.4-2.28-2.73zM12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 22c-5.52 0-10-4.48-10-10S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z"/>
                  </svg>
                  Pagar con MercadoPago
                </>
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-zinc-900 text-gray-400">O transferencia bancaria</span>
              </div>
            </div>

            <div className="bg-zinc-800/50 p-4 rounded-xl border border-white/5 space-y-2 text-sm text-gray-300">
               <div className="flex justify-between">
                 <span>Banco:</span>
                 <span className="font-medium text-white">Santander Río</span>
               </div>
               <div className="flex justify-between">
                 <span>Alias:</span>
                 <span className="font-medium text-white select-all">ARTECHIA.TRANSFER</span>
               </div>
               <div className="flex justify-between">
                 <span>CBU:</span>
                 <span className="font-medium text-white select-all">0000000001234567890</span>
               </div>
            </div>
            
            <p className="text-center text-xs text-gray-500 mt-4">
              Al realizar la transferencia, por favor envíanos el comprobante por WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
