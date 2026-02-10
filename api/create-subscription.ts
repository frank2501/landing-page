import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const executionLog: string[] = [];
  const addLog = (msg: string) => {
    executionLog.push(`${new Date().toISOString()}: ${msg}`);
  };

  try {
    addLog("Raw Fetch Handler Started");
    
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { reason, transaction_amount, id, payer_email } = req.body;
    const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

    if (!MP_ACCESS_TOKEN) {
      addLog("Missing Token");
      return res.status(500).json({ error: 'Config error' });
    }

    // Prepare specialized date (YYYY-MM-DDTHH:mm:ss.SSS-03:00)
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 30);
    // Manually build to avoid TZ issues
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dateStr = `${nextDate.getFullYear()}-${pad(nextDate.getMonth() + 1)}-${pad(nextDate.getDate())}`;
    const timeStr = `${pad(nextDate.getHours())}:${pad(nextDate.getMinutes())}:${pad(nextDate.getSeconds())}`;
    const startDate = `${dateStr}T${timeStr}.000-03:00`;
    
    addLog(`Target Start Date: ${startDate}`);

    const body = {
      reason: reason || 'Suscripción',
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

    addLog("Sending body via fetch...");

    const response = await fetch('https://api.mercadopago.com/preapproval', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `sub_${id}_${Date.now()}`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    addLog(`MP API Status: ${response.status}`);

    if (response.ok) {
      addLog("Success!");
      return res.status(200).json({
        status: 'SUCCESS',
        init_point: data.init_point,
        sandbox_init_point: data.sandbox_init_point || data.init_point,
        log: executionLog
      });
    } else {
      addLog(`MP REJECTION: ${JSON.stringify(data)}`);
      return res.status(response.status).json({
        error: 'MP_FETCH_REJECTION',
        details: data.message || 'Error en API',
        mp_detail: data,
        log: executionLog
      });
    }

  } catch (error: any) {
    addLog(`GLOBAL ERROR: ${error.message}`);
    return res.status(500).json({ 
      error: 'FETCH_LOGIC_ERROR', 
      details: error.message,
      log: executionLog 
    });
  }
}
