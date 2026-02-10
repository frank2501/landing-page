import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const executionLog: string[] = [];
  const addLog = (msg: string) => {
    executionLog.push(`${new Date().toISOString()}: ${msg}`);
  };

  try {
    addLog("Baseline Test Started");
    
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { reason, transaction_amount, id, payer_email } = req.body;
    const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

    if (!MP_ACCESS_TOKEN) {
      return res.status(500).json({ error: 'Config error: Token missing' });
    }

    // Diagnostic: Check token type
    const isProdToken = MP_ACCESS_TOKEN.startsWith('APP_USR-');
    const isTestEmail = payer_email?.includes('test_user') || payer_email?.includes('TESTUSER');
    
    addLog(`Token Type: ${isProdToken ? 'PRODUCTION (APP_USR)' : 'TEST (TEST-)'}`);
    addLog(`Email Type: ${isTestEmail ? 'TEST USER' : 'REAL USER'}`);

    if (isProdToken && isTestEmail) {
      addLog("WARNING: Token/User mismatch detected. Production tokens cannot use Test Buyers.");
    }

    // ABSOLUTE MINIMAL BODY
    // No start_date, no external_reference, no status
    const body = {
      reason: reason || 'Suscripción',
      payer_email: payer_email,
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: Number(transaction_amount),
        currency_id: 'ARS'
      },
      back_url: `${req.headers.origin}/pago/${id}?subscription=active`
    };

    addLog("Sending MINIMAL body to MP...");

    const response = await fetch('https://api.mercadopago.com/preapproval', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    addLog(`MP API Status: ${response.status}`);

    if (response.ok) {
      addLog("Success with minimal body!");
      return res.status(200).json({
        status: 'SUCCESS',
        init_point: data.init_point,
        sandbox_init_point: data.sandbox_init_point || data.init_point,
        log: executionLog
      });
    } else {
      addLog(`MP REJECTION: ${JSON.stringify(data)}`);
      
      // If still 500, we provide a specific tip
      let extraHint = '';
      if (response.status === 500) {
        extraHint = "MP sigue dando 500. Esto suele pasar si el token APP_USR se usa con un mail de prueba, o si la cuenta no tiene activas las suscripciones.";
      }

      return res.status(response.status).json({
        error: 'MP_BASELINE_FAILURE',
        details: data.message || extraHint || 'Rechazo en Baseline',
        mp_detail: data,
        log: executionLog
      });
    }

  } catch (error: any) {
    addLog(`CRITICAL ERROR: ${error.message}`);
    return res.status(500).json({ 
      error: 'BASELINE_LOGIC_ERROR', 
      details: error.message,
      log: executionLog 
    });
  }
}
