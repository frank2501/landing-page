import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Sale {
  id: string;
  clientName: string;
  concept: string;
  amount: number;
  hasSubscription: boolean;
  subscriptionAmount?: number;
  createdAt: string;
  payerFirstName?: string;
  payerLastName?: string;
  payerEmail?: string;
  payStatus?: 'pending' | 'paid';
  nextPaymentDate?: string;
}

const CheckoutPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const [activeMethod, setActiveMethod] = useState<string | null>('transfer');
  const [showSubInfo, setShowSubInfo] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [payerEmail, setPayerEmail] = useState('');
  const [payerFirstName, setPayerFirstName] = useState('');
  const [payerLastName, setPayerLastName] = useState('');
  const [isInfoComplete, setIsInfoComplete] = useState(false);
  const [showSubPrompt, setShowSubPrompt] = useState(false);
  const [searchParams] = useSearchParams();

  // Auto-show subscription prompt after successful payment
  useEffect(() => {
    if (searchParams.get('status') === 'approved' || searchParams.get('status') === 'success') {
      setShowSubPrompt(true);
    }
  }, [searchParams]);

  // Detect payment status and update Firestore
  useEffect(() => {
    const status = searchParams.get('status');
    if ((status === 'approved' || status === 'success') && sale && sale.payStatus !== 'paid') {
      const updateStatus = async () => {
        try {
          const nextDate = new Date();
          nextDate.setMonth(nextDate.getMonth() + 1);
          await updateDoc(doc(db, "sales", id!), {
            payStatus: 'paid',
            nextPaymentDate: sale.hasSubscription ? nextDate.toISOString() : null
          });
          // Refresh local state
          setSale(prev => prev ? { ...prev, payStatus: 'paid' } : null);
          setShowSubPrompt(true);
        } catch (error) {
          console.error("Error updating status:", error);
        }
      };
      updateStatus();
    }
  }, [searchParams, sale, id]);

  useEffect(() => {
    const fetchSale = async () => {
      if (!id) return;
      
      try {
        const docRef = doc(db, "sales", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as Sale;
          setSale({ ...data, id: docSnap.id });
          // If we already have info in DB, pre-fill and skip form
          if (data.payerEmail) {
            setPayerEmail(data.payerEmail);
            setPayerFirstName(data.payerFirstName || '');
            setPayerLastName(data.payerLastName || '');
            setIsInfoComplete(true);
          }
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

  const toggleMethod = (method: string) => {
    setActiveMethod(activeMethod === method ? null : method);
  };

  const handleSubscription = async () => {
    if (!sale || !sale.subscriptionAmount) return;
    if (!payerEmail || !payerEmail.includes('@')) {
      alert('Por favor ingresá un email válido.');
      return;
    }
    setSubLoading(true);

    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: `Suscripción mensual - ${sale.concept}`,
          transaction_amount: sale.subscriptionAmount,
          id: sale.id,
          payer_email: payerEmail,
        }),
      });

      const data = await response.json();
      const redirectUrl = data.init_point || data.sandbox_init_point;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        alert('Error al generar la suscripción. Intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión. Intenta de nuevo.');
    } finally {
      setSubLoading(false);
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

  if (sale.payStatus === 'paid') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
        <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        {sale.hasSubscription ? (
          <div className="text-center max-w-md w-full">
            <h1 className="text-3xl font-bold mb-4">¡Monto Principal Pagado!</h1>
            <p className="text-gray-400 mb-8">
              El pago único ha sido confirmado. Ahora, para finalizar, activá tu suscripción mensual para el mantenimiento y soporte de <strong>{sale.concept}</strong>.
            </p>
            
            <div className="premium-border p-8 rounded-2xl bg-zinc-900/50 backdrop-blur-sm shadow-xl shadow-orange-500/10 mb-8">
              <p className="text-sm text-gray-400 mb-4">Paso final: Activación automática</p>
              <button
                onClick={handleSubscription}
                disabled={subLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 animate-pulse shadow-lg shadow-orange-500/20"
              >
                {subLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Activar Suscripción Mensual
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 mt-4 px-4 leading-relaxed">
                Se cobrarán <span className="text-white">${sale.subscriptionAmount?.toLocaleString('es-AR')}</span> cada mes con tu tarjeta de forma automática. Podés cancelar cuando quieras.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center max-w-md w-full">
            <h1 className="text-3xl font-bold mb-4">¡Pago Confirmado!</h1>
            <p className="text-gray-400 mb-8">
              Hemos recibido tu pago para <strong>{sale.concept}</strong>. En breve nos pondremos en contacto con vos para continuar con la entrega.
            </p>
            <Link to="/" className="inline-block px-8 py-3 border border-orange-500/30 text-orange-400 rounded-full font-bold hover:bg-orange-500/10 transition-colors">
              Volver al inicio
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 bg-black text-white font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Finalizar Pago</h1>
          <p className="text-gray-400">Hola <span className="text-white font-medium">{sale.clientName}</span>, elegí tu método de pago.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT: Information Form or Payment Methods */}
          <div className="lg:col-span-3 space-y-3">
            {!isInfoComplete ? (
              <div className="premium-border p-8 rounded-2xl bg-zinc-900/50 backdrop-blur-sm">
                <h2 className="text-xl font-bold mb-6">Tus datos de contacto</h2>
                <form 
                  onSubmit={async (e) => { 
                    e.preventDefault(); 
                    if (!id) return;
                    try {
                      await updateDoc(doc(db, "sales", id), {
                        payerFirstName,
                        payerLastName,
                        payerEmail,
                      });
                      setIsInfoComplete(true); 
                    } catch (error) {
                      console.error("Error saving info:", error);
                      alert("Error al guardar tus datos. Intenta de nuevo.");
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Nombre</label>
                      <input
                        type="text"
                        value={payerFirstName}
                        onChange={(e) => setPayerFirstName(e.target.value)}
                        placeholder="Juan"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:border-orange-500 outline-none transition-colors placeholder-gray-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Apellido</label>
                      <input
                        type="text"
                        value={payerLastName}
                        onChange={(e) => setPayerLastName(e.target.value)}
                        placeholder="Pérez"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:border-orange-500 outline-none transition-colors placeholder-gray-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                    <input
                      type="email"
                      value={payerEmail}
                      onChange={(e) => setPayerEmail(e.target.value)}
                      placeholder="juan@ejemplo.com"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:border-orange-500 outline-none transition-colors placeholder-gray-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/20 mt-4"
                  >
                    Continuar al pago
                  </button>
                </form>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Método de Pago</h2>
                  <button 
                    onClick={() => setIsInfoComplete(false)}
                    className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    Editar mis datos
                  </button>
                </div>
                {/* Transfer */}
                <div className="rounded-2xl border border-white/10 overflow-hidden transition-all">
                  <button
                    onClick={() => toggleMethod('transfer')}
                    className={`w-full flex items-center justify-between p-5 transition-colors ${
                      activeMethod === 'transfer' ? 'bg-zinc-900/80' : 'bg-zinc-900/30 hover:bg-zinc-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activeMethod === 'transfer' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-gray-400'
                      }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <span className="font-bold text-white block">Transferencia Bancaria</span>
                        <span className="text-xs text-green-400 font-medium">Inmediata</span>
                      </div>
                    </div>
                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${activeMethod === 'transfer' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {activeMethod === 'transfer' && (
                    <div className="p-5 border-t border-white/5 bg-zinc-900/40 space-y-4">
                      <div className="bg-zinc-800/60 p-4 rounded-xl space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Banco</span>
                          <span className="font-medium text-white">Santander Río</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Alias</span>
                          <span className="font-medium text-white select-all cursor-pointer">ARTECHIA.TRANSFER</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">CBU</span>
                          <span className="font-medium text-white select-all cursor-pointer">0000000001234567890</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        Una vez realizada la transferencia, enviá el comprobante por <a href="https://wa.me/5491137758970" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">WhatsApp</a>.
                      </p>
                    </div>
                  )}
                </div>

                {/* MercadoPago */}
                <div className="rounded-2xl border border-white/10 overflow-hidden transition-all">
                  <button
                    onClick={() => toggleMethod('mp')}
                    className={`w-full flex items-center justify-between p-5 transition-colors ${
                      activeMethod === 'mp' ? 'bg-zinc-900/80' : 'bg-zinc-900/30 hover:bg-zinc-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activeMethod === 'mp' ? 'bg-[#009EE3]/20 text-[#009EE3]' : 'bg-zinc-800 text-gray-400'
                      }`}>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M15.54 12.01l-1.67-.5c-.86-.26-1.18-.47-1.18-.94 0-.48.51-.77 1.34-.77.94 0 1.5.37 2.14 1.14l1.4-1.4c-.95-1.1-2.06-1.57-3.54-1.57v-2h-2v2c-1.8 0-3.23 1.13-3.23 2.76 0 1.8 1.48 2.37 2.65 2.73 1.05.32 1.33.56 1.33 1.05 0 .58-.69.87-1.53.87-1.03 0-1.74-.48-2.45-1.3l-1.42 1.4c1.1 1.25 2.45 1.76 3.87 1.76v2h2v-2c1.9 0 3.33-1.18 3.33-2.83 0-1.6-1.1-2.4-2.28-2.73zM12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 22c-5.52 0-10-4.48-10-10S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z"/>
                        </svg>
                      </div>
                      <div className="text-left">
                        <span className="font-bold text-white block">Tarjeta de Crédito / Débito</span>
                        <span className="text-xs text-gray-500">Procesado por MercadoPago</span>
                      </div>
                    </div>
                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${activeMethod === 'mp' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {activeMethod === 'mp' && (
                    <div className="p-5 border-t border-white/5 bg-zinc-900/40 space-y-4">
                      <p className="text-sm text-gray-400 text-center">Serás redirigido a MercadoPago para completar el pago de forma segura.</p>
                      <button
                        onClick={handleMercadoPago}
                        disabled={payLoading}
                        className="w-full bg-[#009EE3] hover:bg-[#008ED0] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#009EE3]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {payLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            Procesando...
                          </>
                        ) : (
                          'Pagar con MercadoPago'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-2">
            <div className="premium-border p-6 rounded-2xl bg-zinc-900/50 backdrop-blur-sm sticky top-28">
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-5">Resumen</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-start">
                  <span className="text-gray-400 text-sm">Servicio</span>
                  <span className="font-medium text-white text-right max-w-[60%]">{sale.concept}</span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Pago único</span>
                  <span className="font-bold text-xl text-orange-400">${sale.amount.toLocaleString('es-AR')}</span>
                </div>

                {sale.hasSubscription && sale.subscriptionAmount && (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400 text-sm">Suscripción mensual</span>
                        <button
                          onClick={() => setShowSubInfo(!showSubInfo)}
                          className="w-5 h-5 rounded-full bg-zinc-800 text-gray-400 hover:text-white hover:bg-zinc-700 flex items-center justify-center transition-colors text-xs font-bold"
                          title="Info sobre suscripción"
                        >
                          i
                        </button>
                      </div>
                      <span className="font-bold text-lg text-white">${sale.subscriptionAmount.toLocaleString('es-AR')}/mes</span>
                    </div>

                    {showSubInfo && (
                      <div className="bg-zinc-800/60 p-4 rounded-xl text-xs text-gray-300 space-y-2 border border-white/5">
                        <p className="font-medium text-white text-sm mb-2">Sobre la suscripción</p>
                        <div className="flex items-start gap-2">
                          <span className="text-orange-400 mt-0.5">•</span>
                          <p>Se cobra <strong>mensualmente</strong> a partir del próximo mes.</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-orange-400 mt-0.5">•</span>
                          <p>Incluye mantenimiento, soporte y actualizaciones del servicio.</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-orange-400 mt-0.5">•</span>
                          <p>Podés <strong>cancelar en cualquier momento</strong> contactándonos por WhatsApp.</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-orange-400 mt-0.5">•</span>
                          <p>No tiene permanencia mínima ni penalidades por baja.</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="border-t border-white/5 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">Total a pagar hoy</span>
                  <span className="font-bold text-2xl text-orange-400">${sale.amount.toLocaleString('es-AR')}</span>
                </div>
              </div>

              {sale.hasSubscription && sale.subscriptionAmount && isInfoComplete && (
                <div className="border-t border-white/5 pt-4 mt-4">
                  <p className="text-xs text-gray-400 mb-3 text-center text-balance">
                    ¡Listo, <span className="text-white font-medium">{payerFirstName}</span>! Activá tu suscripción mensual para {sale.concept}:
                  </p>
                  <button
                    onClick={handleSubscription}
                    disabled={subLoading}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse shadow-lg shadow-orange-500/20"
                  >
                    {subLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Activar Suscripción Mensual
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-gray-500 text-center mt-2 px-4">
                    Se cobrarán <span className="text-white">${sale.subscriptionAmount.toLocaleString('es-AR')}</span> cada mes con tu tarjeta.
                  </p>
                </div>
              )}

              <p className="text-[10px] text-gray-600 text-center mt-6">
                Pagos procesados de forma segura. Al pagar aceptás los{' '}
                <button onClick={() => setShowTerms(true)} className="underline hover:text-gray-400 transition-colors">términos del servicio</button>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowTerms(false)}>
          <div className="bg-zinc-900 border border-white/10 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-white">Términos y Condiciones</h3>
              <button onClick={() => setShowTerms(false)} className="text-gray-400 hover:text-white transition-colors text-2xl leading-none">&times;</button>
            </div>
            <div className="text-sm text-gray-300 space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-1">1. Servicios</h4>
                <p>ArtechIA provee servicios de automatización e inteligencia artificial para negocios. El alcance del servicio contratado se detalla en la propuesta enviada al cliente.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">2. Pagos</h4>
                <p>El pago único se realiza al confirmar el servicio. Si el servicio incluye suscripción mensual, ésta se cobra mensualmente a partir del mes siguiente a la entrega.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">3. Suscripciones</h4>
                <p>Las suscripciones mensuales incluyen mantenimiento, soporte técnico y actualizaciones. No tienen permanencia mínima y pueden cancelarse en cualquier momento notificando por WhatsApp.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">4. Reembolsos</h4>
                <p>Los pagos únicos no son reembolsables una vez iniciado el desarrollo. Las suscripciones no generan reembolso por el mes en curso al cancelar.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">5. Propiedad Intelectual</h4>
                <p>El cliente recibe los derechos de uso del producto entregado. ArtechIA se reserva el derecho de utilizar el caso como referencia comercial salvo acuerdo en contrario.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">6. Confidencialidad</h4>
                <p>ArtechIA se compromete a no divulgar información sensible del cliente. Los datos procesados por las automatizaciones se tratan con estricta confidencialidad.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">7. Contacto</h4>
                <p>Para consultas sobre estos términos: <a href="mailto:contacto@artechia.com" className="text-orange-400 hover:underline">contacto@artechia.com</a></p>
              </div>
            </div>
            <button onClick={() => setShowTerms(false)} className="w-full mt-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-orange-500 hover:text-white transition-colors">
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
