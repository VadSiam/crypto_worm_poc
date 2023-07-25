import { Spot } from '@binance/connector';

export default async function handler(req, res) {
  const { symbol, side, type, timeInForce, quantity, price, recvWindow } = req.body;

  try {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_API_SECRET;
    const client = new Spot(apiKey, apiSecret, { baseURL: process.env.NEXT_BASE_URL });

    const response = await client.newOrder(symbol, side, type, { quantity, price, timeInForce, recvWindow });

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: `Error making order: ${error}` });
  }
}
