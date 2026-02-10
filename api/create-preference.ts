import { MercadoPagoConfig, Preference } from 'mercadopago';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, unit_price, quantity, id, payerEmail } = req.body;

    const preference = new Preference(client);
    
    const result = await preference.create({
      body: {
        items: [
          {
            id: id,
            title: title,
            unit_price: Number(unit_price),
            quantity: Number(quantity),
            currency_id: 'ARS',
          },
        ],
        payer: {
          email: payerEmail
        },
        back_urls: {
          success: `${req.headers.origin}/pago/${id}?status=success`,
          failure: `${req.headers.origin}/pago/${id}?status=failure`,
          pending: `${req.headers.origin}/pago/${id}?status=pending`,
        },
        auto_return: 'approved',
      },
    });

    return res.status(200).json({ init_point: result.init_point });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error creating preference' });
  }
}
