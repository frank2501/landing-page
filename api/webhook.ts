import { MercadoPagoConfig, Payment, PreApproval } from 'mercadopago';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

// Initialize Firebase
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, data, topic, id } = req.body;
    
    // MP sends notifications in different formats (Webhooks vs IPN)
    const resourceType = type || topic;
    const resourceId = (data && data.id) || id;

    if (!resourceType || !resourceId) {
      return res.status(200).send('OK'); // MP requires 200 even for invalid structure to stop retries
    }

    console.log(`[WEBHOOK] Received: ${resourceType} ID: ${resourceId}`);

    if (resourceType === 'payment') {
      const payment = new Payment(client);
      const mpResponse = await payment.get({ id: resourceId });

      if (mpResponse.status === 'approved') {
        const saleId = mpResponse.external_reference;
        if (saleId) {
          const saleRef = doc(db, 'sales', saleId);
          const saleSnap = await getDoc(saleRef);
          
          if (saleSnap.exists()) {
            const saleData = saleSnap.data();
            if (saleData.payStatus !== 'paid') {
              const nextDate = new Date();
              nextDate.setMonth(nextDate.getMonth() + 1);

              await updateDoc(saleRef, {
                payStatus: 'paid',
                nextPaymentDate: saleData.hasSubscription ? nextDate.toISOString() : null,
                lastPaymentId: String(resourceId),
                updatedAt: new Date().toISOString()
              });
              console.log(`[WEBHOOK] Sale ${saleId} updated to paid via webhook`);
            }
          }
        }
      }
    } else if (resourceType === 'preapproval') {
      const preApproval = new PreApproval(client);
      const mpResponse = await preApproval.get({ id: resourceId });

      if (mpResponse.status === 'authorized') {
        const saleId = mpResponse.external_reference;
        if (saleId) {
          const saleRef = doc(db, 'sales', saleId);
          await updateDoc(saleRef, {
            subStatus: 'active',
            updatedAt: new Date().toISOString()
          });
          console.log(`[WEBHOOK] Subscription ${saleId} activated via webhook`);
        }
      }
    }

    return res.status(200).send('OK');

  } catch (error: any) {
    console.error('[WEBHOOK ERROR]', error);
    // Always return 200 to MP unless it's a retryable server crash
    return res.status(200).send('OK');
  }
}
