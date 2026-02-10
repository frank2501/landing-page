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
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

if (!MP_ACCESS_TOKEN) {
  console.error('CRITICAL: MP_ACCESS_TOKEN is missing');
}

const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN || '' });
const payment = new Payment(client);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { payment_id, sale_id } = req.body;
    console.log(`Verifying payment: ${payment_id} for sale: ${sale_id}`);

    if (!payment_id || !sale_id) {
      return res.status(400).json({ error: 'Faltan datos de verificación (payment_id or sale_id)' });
    }

    // 1. Verify with Mercado Pago
    console.log('Fetching status from Mercado Pago...');
    const mpResponse = await payment.get({ id: payment_id });
    console.log(`Mercado Pago status: ${mpResponse.status}`);
    
    if (mpResponse.status === 'approved') {
      // 2. Securely update Firestore
      console.log('Payment approved. Updating Firestore...');
      const saleRef = db.collection('sales').doc(sale_id);
      const saleDoc = await saleRef.get();
      
      if (!saleDoc.exists) {
        console.error(`Sale not found: ${sale_id}`);
        return res.status(404).json({ error: 'Venta no encontrada en la base de datos' });
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

      console.log('Firestore updated successfully.');
      return res.status(200).json({ status: 'approved', message: 'Pago verificado y registrado' });
    } else {
      console.warn(`Payment not approved. Status: ${mpResponse.status}`);
      return res.status(400).json({ status: mpResponse.status, message: `El pago tiene estado: ${mpResponse.status}` });
    }

  } catch (error: any) {
    console.error('Verification error details:', error);
    return res.status(500).json({ 
      error: 'Error interno en la verificación', 
      details: error.message || 'Error desconocido',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
