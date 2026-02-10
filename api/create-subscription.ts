import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
  if (!MP_ACCESS_TOKEN) {
    return res.status(500).json({ error: 'CONFIG_ERROR', details: 'Falta MP_ACCESS_TOKEN en el servidor' });
  }

  try {
    const { reason, transaction_amount, id, payer_email } = req.body;

    if (!payer_email) {
      return res.status(400).json({ error: 'BAD_REQUEST', details: 'Email del pagador es requerido' });
    }

    // Prepare start_date (30 days in the future, noon to be safe)
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 30);
    nextDate.setHours(12, 0, 0, 0);
    const startDate = nextDate.toISOString().replace(/\.\d{3}Z$/, '.000Z');

    const body = {
      reason: reason || 'Suscripción mensual',
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

    console.log('[SUBS] Requesting MP API directly...', JSON.stringify(body, null, 2));

    const mpResponse = await fetch('https://api.mercadopago.com/preapproval', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await mpResponse.json();

    if (mpResponse.ok) {
      console.log('[SUBS] Success:', data.id);
      return res.status(200).json({ 
        status: 'SUCCESS',
        init_point: data.init_point,
        sandbox_init_point: data.sandbox_init_point || data.init_point
      });
    } else {
      console.error('[SUBS] MP API Error:', data);
      return res.status(mpResponse.status).json({ 
        error: 'MP_API_ERROR', 
        details: data.message || 'Error en la API de Mercado Pago',
        mp_detail: data 
      });
    }

  } catch (error: any) {
    console.error('[SUBS] Fetch error:', error);
    return res.status(500).json({ 
      error: 'FETCH_ERROR', 
      details: error.message || 'Error de red o de proceso' 
    });
  }
}
