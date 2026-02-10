import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MercadoPagoConfig, PreApproval } from 'mercadopago';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const executionLog: string[] = [];
  const addLog = (msg: string) => {
    const timestamp = new Date().toISOString();
    console.log(`[SUBS-TRACE] ${msg}`);
    executionLog.push(`${timestamp}: ${msg}`);
  };

  try {
    addLog("Handler started");
    
    if (req.method !== 'POST') {
      addLog("Invalid method: " + req.method);
      return res.status(405).json({ error: 'Method not allowed', log: executionLog });
    }

    addLog("Checking environment variables");
    const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
    if (!MP_ACCESS_TOKEN) {
      addLog("CRITICAL: MP_ACCESS_TOKEN missing");
      return res.status(500).json({ error: 'CONFIG_ERROR', details: 'Access Token missing', log: executionLog });
    }
    addLog("Token found (length: " + MP_ACCESS_TOKEN.length + ")");

    addLog("Initializing MP Config");
    let client;
    try {
      client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
      addLog("MP Config initialized");
    } catch (e: any) {
      addLog("MP Config FAILED: " + e.message);
      throw e;
    }

    addLog("Initializing PreApproval client");
    const preapproval = new PreApproval(client);
    addLog("PreApproval client initialized");

    addLog("Parsing request body");
    const { reason, transaction_amount, id, payer_email } = req.body;
    addLog(`Params: reason=${reason}, amount=${transaction_amount}, id=${id}, email=${payer_email}`);

    if (!payer_email) {
      addLog("Payer email missing in request");
      return res.status(400).json({ error: 'BAD_REQUEST', details: 'Email del pagador es requerido', log: executionLog });
    }

    addLog("Preparing date string");
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 30);
    const startDate = nextDate.toISOString().replace(/\.\d{3}Z$/, '.000Z');
    addLog("Start date set to: " + startDate);

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
    addLog("Body prepared, sending to MP PreApproval.create");

    try {
      const result = await preapproval.create({ body });
      addLog("MP PreApproval.create SUCCESS");
      
      return res.status(200).json({ 
        status: 'SUCCESS',
        init_point: result.init_point,
        sandbox_init_point: (result as any).sandbox_init_point || result.init_point,
        log: executionLog
      });
    } catch (mpError: any) {
      addLog("MP API REJECTION: " + mpError.message);
      const mpData = mpError?.response?.data || mpError?.cause || null;
      return res.status(500).json({ 
        error: 'MP_API_ERROR', 
        details: mpError.message,
        mp_detail: mpData,
        log: executionLog
      });
    }

  } catch (globalError: any) {
    addLog("CRITICAL GLOBAL ERROR: " + globalError.message);
    return res.status(500).json({ 
      error: 'CRITICAL_GLOBAL_ERROR', 
      details: globalError.message, 
      stack: globalError.stack,
      log: executionLog
    });
  }
}
