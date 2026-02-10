import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
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
  subStatus?: 'inactive' | 'active' | 'cancelled';
  nextPaymentDate?: string;
}

const DashboardPage: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [formData, setFormData] = useState({
    clientName: '',
    concept: '',
    amount: '',
    hasSubscription: false,
    subscriptionAmount: ''
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [editForm, setEditForm] = useState({
    clientName: '',
    concept: '',
    amount: '',
    hasSubscription: false,
    subscriptionAmount: ''
  });

  useEffect(() => {
    const q = query(collection(db, "sales"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const salesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Sale[];
      setSales(salesData);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addDoc(collection(db, "sales"), {
        clientName: formData.clientName,
        concept: formData.concept,
        amount: Number(formData.amount),
        hasSubscription: formData.hasSubscription,
        subscriptionAmount: formData.hasSubscription ? Number(formData.subscriptionAmount) : null,
        createdAt: new Date().toISOString(),
        payStatus: 'pending',
        subStatus: formData.hasSubscription ? 'inactive' : null
      });
      
      setFormData({
        clientName: '',
        concept: '',
        amount: '',
        hasSubscription: false,
        subscriptionAmount: ''
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error al crear el link. Verifica tu conexión.");
    }
  };

  const openEdit = (sale: Sale) => {
    setEditingSale(sale);
    setEditForm({
      clientName: sale.clientName,
      concept: sale.concept,
      amount: String(sale.amount),
      hasSubscription: sale.hasSubscription,
      subscriptionAmount: sale.subscriptionAmount ? String(sale.subscriptionAmount) : ''
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSale) return;

    try {
      await updateDoc(doc(db, "sales", editingSale.id), {
        clientName: editForm.clientName,
        concept: editForm.concept,
        amount: Number(editForm.amount),
        hasSubscription: editForm.hasSubscription,
        subscriptionAmount: editForm.hasSubscription ? Number(editForm.subscriptionAmount) : null,
        subStatus: editForm.hasSubscription ? (editingSale.subStatus || 'inactive') : null
      });
      setEditingSale(null);
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("Error al actualizar. Verifica tu conexión.");
    }
  };

  const togglePayStatus = async (sale: Sale) => {
    const newStatus = sale.payStatus === 'paid' ? 'pending' : 'paid';
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 1);
    
    try {
      await updateDoc(doc(db, "sales", sale.id), {
        payStatus: newStatus,
        nextPaymentDate: (newStatus === 'paid' && sale.hasSubscription) ? nextDate.toISOString() : null
      });
    } catch (error) {
      console.error("Error updating status: ", error);
    }
  };

  const toggleSubStatus = async (sale: Sale) => {
    if (!sale.hasSubscription) return;
    const newStatus = sale.subStatus === 'active' ? 'cancelled' : 'active';
    
    try {
      await updateDoc(doc(db, "sales", sale.id), {
        subStatus: newStatus
      });
    } catch (error) {
      console.error("Error updating sub status: ", error);
    }
  };

  const copyLink = (id: string) => {
    const link = `${window.location.origin}/pago/${id}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteSale = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este link?')) {
      try {
        await deleteDoc(doc(db, "sales", id));
      } catch (error) {
        console.error("Error removing document: ", error);
        alert("Error al eliminar.");
      }
    }
  };

  const filteredSales = sales.filter(sale =>
    sale.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sale.payerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sale.payerFirstName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-black text-white font-sans selection:bg-orange-500/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent pb-2">
              Dashboard de <span className="italic">Pagos</span>
            </h1>
            <p className="text-gray-500 font-medium ml-1">Gestioná tus links de ArtechIA con precisión.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-zinc-900 border border-white/5 rounded-full text-xs font-bold uppercase tracking-widest text-gray-400">
               {sales.length} Links Totales
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Formulario de Nueva Venta */}
          <div className="lg:col-span-1">
            <div className="premium-border p-8 rounded-3xl bg-zinc-900/40 backdrop-blur-xl sticky top-32 border-white/5 shadow-2xl shadow-orange-500/5">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-black">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </span>
                Nuevo Link
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Referencia interna</label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800/50 border border-white/5 rounded-xl px-4 py-3 focus:border-orange-500 outline-none transition-all focus:ring-4 focus:ring-orange-500/10"
                    placeholder="Ej: Juan Pérez - Bot"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Concepto visible al cliente</label>
                  <input
                    type="text"
                    name="concept"
                    value={formData.concept}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800/50 border border-white/5 rounded-xl px-4 py-3 focus:border-orange-500 outline-none transition-all focus:ring-4 focus:ring-orange-500/10"
                    placeholder="Ej: Desarrollo de IA"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Monto Pago Único (ARS)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        className="w-full bg-zinc-800/50 border border-white/5 rounded-xl pl-8 pr-4 py-3 focus:border-orange-500 outline-none transition-all focus:ring-4 focus:ring-orange-500/10"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-2xl bg-zinc-800/30 border border-white/5 mt-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="hasSubscription" className="text-sm font-bold text-gray-300 select-none cursor-pointer">
                      Suscripción Mensual
                    </label>
                    <input
                      type="checkbox"
                      id="hasSubscription"
                      name="hasSubscription"
                      checked={formData.hasSubscription}
                      onChange={handleInputChange}
                      className="w-6 h-6 rounded-lg border-white/10 text-orange-500 focus:ring-orange-500 bg-zinc-800 cursor-pointer transition-all"
                    />
                  </div>

                  {formData.hasSubscription && (
                    <div className="mt-4 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Monto Mensual (ARS)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                        <input
                          type="number"
                          name="subscriptionAmount"
                          value={formData.subscriptionAmount}
                          onChange={handleInputChange}
                          onWheel={(e) => (e.target as HTMLInputElement).blur()}
                          className="w-full bg-zinc-800/80 border border-white/5 rounded-xl pl-8 pr-4 py-3 focus:border-orange-500 outline-none transition-all"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:scale-[1.02] active:scale-[0.98] text-black font-black py-4 rounded-xl transition-all mt-6 shadow-xl shadow-orange-500/20 uppercase tracking-widest text-sm"
                >
                  Crear Link
                </button>
              </form>
            </div>
          </div>

          {/* Lista de Ventas */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
              <h2 className="text-2xl font-bold italic">Actividad Reciente</h2>
              {/* Search Bar */}
              <div className="relative w-full sm:w-80 group">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por cliente, email o concepto..."
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-full pl-12 pr-6 py-3.5 text-sm focus:border-orange-500 outline-none transition-all placeholder-gray-600 focus:bg-zinc-900 focus:ring-4 focus:ring-orange-500/5"
                />
              </div>
            </div>

            <div className="space-y-6">
              {filteredSales.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900/20 rounded-3xl border border-white/5 border-dashed">
                  <p className="text-gray-500 font-medium">
                    {searchQuery ? 'No se encontraron resultados para tu búsqueda.' : 'Todavía no generaste ningún link de pago.'}
                  </p>
                </div>
              ) : (
                filteredSales.map(sale => (
                  <div key={sale.id} className="group relative">
                    {/* Background Glow Effect */}
                    <div className={`absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 blur ${
                      sale.payStatus === 'paid' ? 'bg-green-500/10' : 'bg-orange-500/10'
                    }`}></div>
                    
                    <div className="relative premium-border p-6 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border-white/5 hover:bg-zinc-900/60 transition-all">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                        <div className="flex-1">
                          <div className="flex items-center flex-wrap gap-2 mb-3">
                            <h3 className="font-black text-xl text-white tracking-tight">{sale.concept}</h3>
                            
                            {/* Pago Único Status */}
                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                              sale.payStatus === 'paid' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${sale.payStatus === 'paid' ? 'bg-green-400 animate-pulse' : 'bg-orange-400'}`}></span>
                              Pago: {sale.payStatus === 'paid' ? 'Completado' : 'Pendiente'}
                            </div>

                            {/* Subscription Status */}
                            {sale.hasSubscription && (
                              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                sale.subStatus === 'active' 
                                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                                  : sale.subStatus === 'cancelled'
                                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                    : 'bg-zinc-800 text-gray-500 border border-white/5'
                              }`}>
                                Sub: {
                                  sale.subStatus === 'active' ? 'Activa' : 
                                  sale.subStatus === 'cancelled' ? 'Cancelada' : 'No Iniciada'
                                }
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-sm text-gray-500 mb-5">
                            <span className="font-bold text-gray-400">Ref: {sale.clientName}</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                            <span>{new Date(sale.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}</span>
                          </div>
                          
                          {sale.payerEmail && (
                            <div className="mb-6 bg-white/5 p-4 rounded-2xl border border-white/5">
                              <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Datos del Cliente
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-gray-400 mb-0.5">Nombre</p>
                                  <p className="font-bold text-white text-sm">{sale.payerFirstName} {sale.payerLastName}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400 mb-0.5">Contacto</p>
                                  <p className="font-bold text-gray-300 text-sm truncate">{sale.payerEmail}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap items-end gap-6 pt-2 border-t border-white/5">
                            <div>
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Monto Principal</p>
                              <p className="text-2xl font-black text-white">${sale.amount.toLocaleString('es-AR')}</p>
                            </div>
                            
                            {sale.hasSubscription && (
                              <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Monto Mensual</p>
                                <div className="flex items-baseline gap-2">
                                  <p className="text-xl font-bold text-gray-400">${sale.subscriptionAmount?.toLocaleString('es-AR')}</p>
                                  <span className="text-gray-600 text-[10px] font-bold">/MES</span>
                                </div>
                                {sale.payStatus === 'paid' && sale.nextPaymentDate && (
                                  <p className="text-[10px] text-green-500 font-black mt-1 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    PRÓXIMO: {new Date(sale.nextPaymentDate).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 w-full sm:w-48">
                          <button
                            onClick={() => togglePayStatus(sale)}
                            className={`p-3 rounded-2xl border transition-all flex items-center justify-between px-5 ${
                              sale.payStatus === 'paid' 
                                ? 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20' 
                                : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/20'
                            }`}
                          >
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              {sale.payStatus === 'paid' ? 'Pago Recibido' : 'Marcar Pago'}
                            </span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>

                          {sale.hasSubscription && (
                            <button
                              onClick={() => toggleSubStatus(sale)}
                              className={`p-3 rounded-2xl border transition-all flex items-center justify-between px-5 ${
                                sale.subStatus === 'active' 
                                  ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20' 
                                  : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/20'
                              }`}
                            >
                              <span className="text-[10px] font-black uppercase tracking-widest">
                                {sale.subStatus === 'active' ? 'Sub Activa' : 'Activar Sub'}
                              </span>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </button>
                          )}

                          <button
                            onClick={() => copyLink(sale.id)}
                            className={`p-3 rounded-2xl border transition-all flex items-center justify-between px-5 ${
                              copiedId === sale.id 
                                ? 'bg-orange-500 text-black border-orange-600' 
                                : 'bg-white text-black border-white hover:bg-white/90 shadow-lg shadow-white/5'
                            }`}
                          >
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                              {copiedId === sale.id ? '¡Copiado!' : 'Copiar Link'}
                            </span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          </button>
                          
                          <div className="flex gap-2 w-full">
                            <button
                              onClick={() => openEdit(sale)}
                              className="flex-1 p-3 rounded-2xl border border-white/5 text-gray-500 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center"
                              title="Editar link"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => deleteSale(sale.id)}
                              className="flex-1 p-3 rounded-2xl border border-red-500/10 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center"
                              title="Eliminar"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal Refined */}
      {editingSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={() => setEditingSale(null)}>
          <div className="bg-zinc-900 border border-white/10 rounded-[32px] max-w-md w-full p-8 shadow-2xl shadow-orange-500/10" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-white italic tracking-tight uppercase">Editar Link</h3>
              <button 
                onClick={() => setEditingSale(null)} 
                className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all text-2xl"
              >&times;</button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Referencia interna</label>
                <input
                  type="text"
                  name="clientName"
                  value={editForm.clientName}
                  onChange={handleEditInputChange}
                  className="w-full bg-zinc-800/80 border border-white/5 rounded-xl px-4 py-3 focus:border-orange-500 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Concepto al cliente</label>
                <input
                  type="text"
                  name="concept"
                  value={editForm.concept}
                  onChange={handleEditInputChange}
                  className="w-full bg-zinc-800/80 border border-white/5 rounded-xl px-4 py-3 focus:border-orange-500 outline-none transition-all"
                  required
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Monto Pago Único (ARS)</label>
                  <input
                    type="number"
                    name="amount"
                    value={editForm.amount}
                    onChange={handleEditInputChange}
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    className="w-full bg-zinc-800/80 border border-white/5 rounded-xl px-4 py-3 focus:border-orange-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-800/40 rounded-2xl border border-white/5">
                <label htmlFor="editHasSubscription" className="text-sm font-bold text-gray-300 select-none cursor-pointer">
                  Mantenimiento mensual
                </label>
                <input
                  type="checkbox"
                  id="editHasSubscription"
                  name="hasSubscription"
                  checked={editForm.hasSubscription}
                  onChange={handleEditInputChange}
                  className="w-6 h-6 rounded-lg border-white/10 text-orange-500 focus:ring-orange-500 bg-zinc-800 cursor-pointer"
                />
              </div>

              {editForm.hasSubscription && (
                <div className="animate-in slide-in-from-top-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Monto Mensual (ARS)</label>
                  <input
                    type="number"
                    name="subscriptionAmount"
                    value={editForm.subscriptionAmount}
                    onChange={handleEditInputChange}
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    className="w-full bg-zinc-800/80 border border-white/5 rounded-xl px-4 py-3 focus:border-orange-500 outline-none transition-all"
                    required
                  />
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingSale(null)}
                  className="flex-1 py-4 text-gray-500 font-bold hover:text-white transition-all uppercase tracking-widest text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-white text-black font-black rounded-xl hover:bg-orange-500 hover:text-white hover:scale-105 transition-all shadow-xl shadow-white/5 uppercase tracking-widest text-xs"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
