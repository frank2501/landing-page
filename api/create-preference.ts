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
        back_urls: {
          success: `${req.headers.origin}/pago/${id}?status=success`,
        },
        auto_return: 'approved',
        binary_mode: true,
      },
    });

    return res.status(200).json({ 
      init_point: result.init_point,
      sandbox_init_point: (result as any).sandbox_init_point || result.init_point,
      token_type: process.env.MP_ACCESS_TOKEN?.startsWith('TEST-') ? 'TEST' : 'LIVE_TEST',
      token_hint: `${process.env.MP_ACCESS_TOKEN?.substring(0, 11)}...${process.env.MP_ACCESS_TOKEN?.slice(-4)}`
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error creating preference' });
  }
}
