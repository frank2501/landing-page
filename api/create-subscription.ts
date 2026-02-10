import { MercadoPagoConfig, PreApproval } from 'mercadopago';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { reason, transaction_amount, id } = req.body;

    const preapproval = new PreApproval(client);

    const result = await preapproval.create({
      body: {
        reason: reason,
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          transaction_amount: Number(transaction_amount),
          currency_id: 'ARS',
        },
        back_url: `${req.headers.origin}/pago/${id}?subscription=active`,
        payer_email: '',
      },
    });

    return res.status(200).json({ init_point: result.init_point });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error creating subscription' });
  }
}
