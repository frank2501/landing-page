import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { reason, transaction_amount, id, payer_email } = req.body;
    const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

    if (!MP_ACCESS_TOKEN) {
      return res.status(500).json({ error: 'Config error: Token missing' });
    }

    if (!payer_email) {
      return res.status(400).json({ error: 'Email del pagador es requerido' });
    }

    // Prepare start_date (30 days in the future, noon)
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 30);
    nextDate.setHours(12, 0, 0, 0);
    
    // Format: YYYY-MM-DDTHH:mm:ss.000-03:00 (Mercado Pago strict format)
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dateStr = `${nextDate.getFullYear()}-${pad(nextDate.getMonth() + 1)}-${pad(nextDate.getDate())}`;
    const timeStr = `${pad(nextDate.getHours())}:${pad(nextDate.getMinutes())}:${pad(nextDate.getSeconds())}`;
    const startDate = `${dateStr}T${timeStr}.000-03:00`;

    const body = {
      reason: reason || 'Suscripción mensual',
      payer_email: payer_email,
      external_reference: id,
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: Number(transaction_amount),
        currency_id: 'ARS',
        start_date: startDate
      },
      back_url: `${req.headers.origin}/pago/${id}?subscription=active`,
      status: 'pending'
    };

    const response = await fetch('https://api.mercadopago.com/preapproval', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `sub_${id}`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({
        init_point: data.init_point,
        sandbox_init_point: data.sandbox_init_point || data.init_point
      });
    } else {
      console.error('[MP_ERROR]', data);
      return res.status(response.status).json({
        error: 'MP_REJECTION',
        details: data.message || 'Error en validación de Mercado Pago',
        mp_detail: data
      });
    }

  } catch (error: any) {
    console.error('[SERVER_ERROR]', error);
    return res.status(500).json({ 
      error: 'SERVER_ERROR', 
      details: error.message 
    });
  }
}
