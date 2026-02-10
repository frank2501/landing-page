import { MercadoPagoConfig, Payment } from 'mercadopago';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

// Initialize Firebase Client SDK (compatible with Vercel/Node)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
const payment = new Payment(client);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { payment_id, sale_id } = req.body;
    console.log(`[DEBUG] Verifying: ${payment_id} for sale: ${sale_id}`);

    if (!payment_id || !sale_id) {
      return res.status(400).json({ error: 'Faltan datos: payment_id o sale_id' });
    }

    // 1. Verify with Mercado Pago
    const mpResponse = await payment.get({ id: payment_id });
    console.log(`[DEBUG] MP Status: ${mpResponse.status}`);
    
    if (mpResponse.status === 'approved') {
      // 2. Update Firestore securely
      const saleRef = doc(db, 'sales', sale_id);
      const saleSnap = await getDoc(saleRef);
      
      if (!saleSnap.exists()) {
        return res.status(404).json({ error: 'Venta no encontrada en la base de datos' });
      }

      const saleData = saleSnap.data();
      const nextDate = new Date();
      nextDate.setMonth(nextDate.getMonth() + 1);

      await updateDoc(saleRef, {
        payStatus: 'paid',
        nextPaymentDate: saleData?.hasSubscription ? nextDate.toISOString() : null,
        lastPaymentId: payment_id,
        updatedAt: new Date().toISOString()
      });

      return res.status(200).json({ status: 'approved', message: 'Pago verificado y registrado' });
    } else {
      return res.status(400).json({ status: mpResponse.status, message: `El pago tiene estado: ${mpResponse.status}` });
    }

  } catch (error: any) {
    console.error('[ERROR] Verification error details:', error);
    return res.status(500).json({ 
      error: 'Error interno en la verificación', 
      details: error.message || 'Error desconocido'
    });
  }
}
