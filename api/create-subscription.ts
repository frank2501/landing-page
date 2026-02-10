import { MercadoPagoConfig, PreApproval } from 'mercadopago';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
  if (!MP_ACCESS_TOKEN) {
    console.error('[SUBS] CRITICAL: MP_ACCESS_TOKEN is missing');
    return res.status(500).json({ error: 'System configuration error: Access Token missing' });
  }

  const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
  const preapproval = new PreApproval(client);

  try {
    const { reason, transaction_amount, id, payer_email } = req.body;

    if (!payer_email) {
      return res.status(400).json({ error: 'Email del pagador es requerido' });
    }

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 30);
    // Format: YYYY-MM-DDTHH:mm:ss.000-03:00 (Mercado Pago is very strict)
    // Actually .000Z is usually safer for ISO
    const startDate = nextDate.toISOString().replace(/\.\d{3}Z$/, '.000Z');

    const body = {
      reason: reason,
      payer_email: payer_email,
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: Number(transaction_amount),
        currency_id: 'ARS',
        start_date: startDate,
      },
      back_url: `${req.headers.origin}/pago/${id}?subscription=active`,
    };

    console.log('[SUBS] Requesting MP with body:', JSON.stringify(body, null, 2));

    const result = await preapproval.create({ body });

    console.log('[SUBS] MP Response success:', !!result.id);

    return res.status(200).json({ 
      init_point: result.init_point,
      sandbox_init_point: (result as any).sandbox_init_point || result.init_point
    });
  } catch (error: any) {
    console.error('[SUBS ERROR] Full catch info:', error);
    
    // Extracting MP specific error details if they exist
    const mpError = error?.response?.data || error?.cause || null;
    const errorMsg = mpError?.message || error?.message || 'Error desconocido en MP';

    return res.status(500).json({ 
      error: 'Error en Mercado Pago',
      details: errorMsg,
      mp_detail: mpError
    });
  }
}
