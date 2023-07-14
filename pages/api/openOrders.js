import { Spot } from '@binance/connector';

export default async function handler(req, res) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_API_SECRET;
    const client = new Spot(apiKey, apiSecret, { baseURL: 'https://api3.binance.com' });

    const response = await client.openOrders({ symbol: 'BTCUSDT', recvWindow: 5000 });

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: 'Error getting open orders' });
  }
}
