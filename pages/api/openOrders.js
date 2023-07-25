import { Spot } from '@binance/connector';

export default async function handler(req, res) {
  try {
    console.log(`Base URL: ${process.env.NEXT_BASE_URL}`);
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_API_SECRET;
    const client = new Spot(apiKey, apiSecret, { baseURL: process.env.NEXT_BASE_URL });

    const response = await client.openOrders({ symbol: 'BTCUSDT', recvWindow: 5000 });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(error.response.data);
      console.error(error.response.status);
      console.error(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in Node.js
      console.error(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error', error.message);
    }
    console.error(error.config);
    return res.status(500).json({ error: `Error getting open orders: ${error}` });
  }
}
