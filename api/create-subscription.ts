import { MercadoPagoConfig, PreApproval } from 'mercadopago';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // TEST: See if the function is even reachable
  return res.status(200).json({ 
    test: 'REACHED', 
    mehod: req.method,
    env_token: !!process.env.MP_ACCESS_TOKEN 
  });

  /* Rest of code commented out for this test
  try {
    // ...
  } catch (e) {
    // ...
  }
  */
}
