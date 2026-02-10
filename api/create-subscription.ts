import { MercadoPagoConfig, PreApproval } from 'mercadopago';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
  if (!MP_ACCESS_TOKEN) {
    return res.status(500).json({ error: 'CONFIG_ERROR', details: 'Missing MP_ACCESS_TOKEN' });
  }

  try {
    // Phase 1: Init
    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
    const preapproval = new PreApproval(client);
    
    const { reason, transaction_amount, id, payer_email } = req.body;
    if (!payer_email) {
      return res.status(400).json({ error: 'BAD_REQUEST', details: 'Email del pagador es requerido' });
    }

    // Phase 2: Date Calculation
    // Use a fixed date format that is simpler
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 30);
    // Format: 2026-03-12T12:00:00.000Z
    const startDate = nextDate.toISOString().replace(/\.\d+Z$/, '.000Z');

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

    console.log('[DEBUG] Calling MP PreApproval with:', JSON.stringify(body, null, 2));

    // Phase 3: The actual call
    try {
      const result = await preapproval.create({ body });
      
      return res.status(200).json({ 
        status: 'SUCCESS',
        init_point: result.init_point,
        sandbox_init_point: (result as any).sandbox_init_point || result.init_point
      });
    } catch (mpError: any) {
      console.error('[DEBUG] MP API Call failed:', mpError);
      return res.status(500).json({ 
        error: 'MP_API_REJECTION', 
        details: mpError.message || 'Error en la llamada a MP',
        mp_data: mpError?.response?.data || mpError?.cause || null
      });
    }

  } catch (globalError: any) {
    console.error('[DEBUG] Global crash:', globalError);
    return res.status(500).json({ 
      error: 'LOGIC_CRASH', 
      details: globalError.message, 
      phase: 'DATA_PREP' 
    });
  }
}
