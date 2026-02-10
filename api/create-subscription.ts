import { MercadoPagoConfig, PreApproval } from 'mercadopago';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { reason, transaction_amount, id, payer_email } = req.body;

    if (!payer_email) {
      return res.status(400).json({ error: 'Email del pagador es requerido' });
    }

    const preapproval = new PreApproval(client);

    console.log(`[SUBS] Creating preapproval for: ${payer_email}, amount: ${transaction_amount}`);
    
    const body = {
      reason: reason,
      payer_email: payer_email,
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: Number(transaction_amount),
        currency_id: 'ARS',
        // Mercado Pago format: YYYY-MM-DDTHH:mm:ss.000Z
        start_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().replace(/\.\d{3}Z$/, '.000Z'),
      },
      back_url: `${req.headers.origin}/pago/${id}?subscription=active`,
    };

    console.log('[SUBS] Request body:', JSON.stringify(body, null, 2));

    const result = await preapproval.create({ body });

    console.log('[SUBS] Result success:', !!result.init_point);

    return res.status(200).json({ 
      init_point: result.init_point,
      sandbox_init_point: (result as any).sandbox_init_point || result.init_point
    });
  } catch (error: any) {
    console.error('[SUBS ERROR] Full detail:', error);
    // Return detailed error if possible for debugging
    return res.status(500).json({ 
      error: 'Error al generar la suscripción',
      details: error?.message || 'Error desconocido',
      mp_detail: error?.cause || error?.response?.data || null
    });
  }
}
