import { MercadoPagoConfig, Payment } from 'mercadopago';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, cert, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin (safe for multiple calls)
try {
  getApp();
} catch (e) {
  // Use environment variables for Firebase Admin
  // For simplicity since it's already used on client, 
  // we'll assume the client config is enough or use a service account if available.
  // In Vercel, we often use FIREBASE_SERVICE_ACCOUNT env var.
  // If not present, we can use the project ID.
  initializeApp({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  });
}

const db = getFirestore();
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
const payment = new Payment(client);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { payment_id, sale_id } = req.body;

    if (!payment_id || !sale_id) {
      return res.status(400).json({ error: 'Faltan datos de verificación' });
    }

    // 1. Verify with Mercado Pago
    const mpResponse = await payment.get({ id: payment_id });
    
    if (mpResponse.status === 'approved') {
      // 2. Securely update Firestore
      const saleRef = db.collection('sales').doc(sale_id);
      const saleDoc = await saleRef.get();
      
      if (!saleDoc.exists) {
        return res.status(404).json({ error: 'Venta no encontrada' });
      }

      const saleData = saleDoc.data();
      const nextDate = new Date();
      nextDate.setMonth(nextDate.getMonth() + 1);

      await saleRef.update({
        payStatus: 'paid',
        nextPaymentDate: saleData?.hasSubscription ? nextDate.toISOString() : null,
        lastPaymentId: payment_id,
        updatedAt: new Date().toISOString()
      });

      return res.status(200).json({ status: 'approved', message: 'Pago verificado y registrado' });
    } else {
      return res.status(400).json({ status: mpResponse.status, message: 'El pago no está aprobado' });
    }

  } catch (error: any) {
    console.error('Verification error:', error);
    return res.status(500).json({ error: error.message || 'Error en la verificación' });
  }
}
