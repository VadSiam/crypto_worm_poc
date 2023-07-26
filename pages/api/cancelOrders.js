import { Spot } from '@binance/connector';

export default async function handler(req, res) {
  const { symbol } = req.body;

  try {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_API_SECRET;
    const client = new Spot(apiKey, apiSecret, { baseURL: process.env.NEXT_PUBLIC_BASE_URL });

    const response = await client.cancelOpenOrders(symbol, { recvWindow: 5000 });

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: 'Error cancelling orders' });
  }
}
