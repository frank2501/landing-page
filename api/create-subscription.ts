import { MercadoPagoConfig, PreApproval } from 'mercadopago';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Global try-catch for EVERYTHING
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
    if (!MP_ACCESS_TOKEN) {
      return res.status(500).json({ error: 'CONFIG_ERROR', details: 'MP_ACCESS_TOKEN is missing' });
    }

    let client, preapproval;
    try {
      client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
      preapproval = new PreApproval(client);
    } catch (e: any) {
      return res.status(500).json({ error: 'INIT_ERROR', details: e.message, stack: e.stack });
    }

    const { reason, transaction_amount, id, payer_email } = req.body;

    if (!payer_email) {
      return res.status(400).json({ error: 'BAD_REQUEST', details: 'Email del pagador es requerido' });
    }

    // Ultra-safe date generation
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 30);
    const startDate = nextDate.toISOString().split('.')[0] + '.000Z';

    const body = {
      reason: reason || 'Suscripción',
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

    try {
      const result = await preapproval.create({ body });
      
      if (!result || !result.init_point) {
        return res.status(500).json({ 
          error: 'MP_EMPTY_RESPONSE', 
          details: 'MP returned success but no init_point',
          raw: JSON.stringify(result) 
        });
      }

      return res.status(200).json({ 
        init_point: result.init_point,
        sandbox_init_point: (result as any).sandbox_init_point || result.init_point
      });
    } catch (mpError: any) {
      const mpData = mpError?.response?.data || mpError?.cause || null;
      return res.status(500).json({ 
        error: 'MP_API_ERROR', 
        details: mpError.message || 'Error en la llamada a MP',
        mp_detail: mpData 
      });
    }

  } catch (globalError: any) {
    return res.status(500).json({ 
      error: 'CRITICAL_GLOBAL_ERROR', 
      details: globalError.message, 
      stack: globalError.stack 
    });
  }
}
