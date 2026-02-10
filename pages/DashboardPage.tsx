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
        createdAt: new Date().toISOString()
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
      });
      setEditingSale(null);
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("Error al actualizar. Verifica tu conexión.");
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
    sale.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-black text-white font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-orange-500">Panel de Gestión de Pagos</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de Nueva Venta */}
          <div className="lg:col-span-1">
            <div className="premium-border p-6 rounded-2xl bg-zinc-900/50 backdrop-blur-sm sticky top-32">
              <h2 className="text-2xl font-bold mb-6">Generar Nuevo Link</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Cliente</label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:border-orange-500 outline-none transition-colors"
                    placeholder="Nombre del cliente"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Concepto</label>
                  <input
                    type="text"
                    name="concept"
                    value={formData.concept}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:border-orange-500 outline-none transition-colors"
                    placeholder="Ej: Desarrollo Web"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Monto Total (ARS)</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:border-orange-500 outline-none transition-colors"
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="hasSubscription"
                    name="hasSubscription"
                    checked={formData.hasSubscription}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-gray-600 text-orange-500 focus:ring-orange-500 bg-zinc-800"
                  />
                  <label htmlFor="hasSubscription" className="text-sm select-none cursor-pointer">
                    Incluir suscripción mensual
                  </label>
                </div>

                {formData.hasSubscription && (
                  <div className="animate-fade-in">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Monto Mensual (ARS)</label>
                    <input
                      type="number"
                      name="subscriptionAmount"
                      value={formData.subscriptionAmount}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:border-orange-500 outline-none transition-colors"
                      placeholder="0.00"
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors mt-6"
                >
                  Generar Link de Pago
                </button>
              </form>
            </div>
          </div>

          {/* Lista de Ventas */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold">Links Generados</h2>
              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por cliente..."
                  className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-orange-500 outline-none transition-colors placeholder-gray-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {searchQuery && (
              <p className="text-xs text-gray-500 mb-3">
                {filteredSales.length} resultado{filteredSales.length !== 1 ? 's' : ''} para "{searchQuery}"
              </p>
            )}

            <div className="space-y-4">
              {filteredSales.length === 0 ? (
                <p className="text-gray-500 text-center py-10">
                  {searchQuery ? 'No se encontraron resultados.' : 'No hay links generados todavía.'}
                </p>
              ) : (
                filteredSales.map(sale => (
                  <div key={sale.id} className="premium-border p-6 rounded-2xl bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="font-bold text-lg text-white">{sale.concept}</h3>
                      <p className="text-gray-400 text-sm mb-1">Cliente: <span className="text-white">{sale.clientName}</span></p>
                      <div className="flex gap-3 text-sm">
                        <span className="text-orange-400 font-medium">
                          ${sale.amount.toLocaleString('es-AR')}
                        </span>
                        {sale.hasSubscription && (
                          <span className="text-zinc-400 bg-zinc-800 px-2 rounded text-xs flex items-center">
                            + ${sale.subscriptionAmount?.toLocaleString('es-AR')}/mes
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-xs mt-2">
                        Creado: {new Date(sale.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => copyLink(sale.id)}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium transition-all ${
                          copiedId === sale.id 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-white text-black hover:bg-gray-200'
                        }`}
                      >
                        {copiedId === sale.id ? 'Copiado!' : 'Copiar Link'}
                      </button>
                      <button
                        onClick={() => openEdit(sale)}
                        className="px-3 py-2 rounded-lg border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 transition-colors"
                        title="Editar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteSale(sale.id)}
                        className="px-3 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Eliminar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setEditingSale(null)}>
          <div className="bg-zinc-900 border border-white/10 rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-white">Editar Link de Pago</h3>
              <button onClick={() => setEditingSale(null)} className="text-gray-400 hover:text-white transition-colors text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Cliente</label>
                <input
                  type="text"
                  name="clientName"
                  value={editForm.clientName}
                  onChange={handleEditInputChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:border-orange-500 outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Concepto</label>
                <input
                  type="text"
                  name="concept"
                  value={editForm.concept}
                  onChange={handleEditInputChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:border-orange-500 outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Monto Total (ARS)</label>
                <input
                  type="number"
                  name="amount"
                  value={editForm.amount}
                  onChange={handleEditInputChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:border-orange-500 outline-none transition-colors"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="editHasSubscription"
                  name="hasSubscription"
                  checked={editForm.hasSubscription}
                  onChange={handleEditInputChange}
                  className="w-4 h-4 rounded border-gray-600 text-orange-500 focus:ring-orange-500 bg-zinc-800"
                />
                <label htmlFor="editHasSubscription" className="text-sm select-none cursor-pointer">
                  Incluir suscripción mensual
                </label>
              </div>

              {editForm.hasSubscription && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Monto Mensual (ARS)</label>
                  <input
                    type="number"
                    name="subscriptionAmount"
                    value={editForm.subscriptionAmount}
                    onChange={handleEditInputChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:border-orange-500 outline-none transition-colors"
                    required
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSale(null)}
                  className="flex-1 py-3 border border-zinc-700 text-gray-300 rounded-xl hover:bg-zinc-800 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors"
                >
                  Guardar Cambios
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
