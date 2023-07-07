// pages/api/binance.js
import { Spot } from '@binance/connector'

const apiKey = process.env.NEXT_PUBLIC_API_KEY
const apiSecret = process.env.NEXT_PUBLIC_API_SECRET


export default async (req, res) => {
  const client = new Spot(apiKey, apiSecret, { baseURL: 'https://testnet.binance.vision' })
  const { method, endpoint, params } = req.body;
  console.log('🚀 ~ file: binance.js:11 ~ params:', params)

  try {
    let response;

    switch (method) {
      case 'GET':
        response = await client[endpoint](params);
        break;
      case 'POST':
        response = await client[endpoint](params.symbol, params.side, params.type, params);
        break;
      case 'DELETE':
        response = await client[endpoint](params);
        break;
      case 'GET_AND_DELETE':
        // Fetch open orders
        const openOrders = await client['openOrders'](params);
        console.log('🚀 ~ file: binance.js:29 ~ params:', openOrders)

        // Extract orderIds from open orders
        const clientOrdersParse = openOrders.data.map(order => {
          return ({
            symbol: order.symbol,
            clientId: order.clientId,
            timestamp: Date.now(),
          })
        });

        // Cancel each open order
        const cancelOrderPromises = clientOrdersParse.map(clientOrderParse => client['openOrders']({ ...clientOrderParse }));
        response = await Promise.all(cancelOrderPromises);
        console.log('🚀 ~ file: binance.js:43 ~ response:', response)

        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    res.status(200).json(response.data);
  } catch (error) {
    const errorMsg = JSON.stringify(error?.response?.data);
    console.error(`Binance client error: ${errorMsg}`);
    res.status(500).json({ status: 'error', message: error.message });
  }
}

// Example usage:
// const order = {
//   symbol: 'BTCUSDT',
//   side: 'BUY',
//   type: 'LIMIT',
//   timeInForce: 'GTC',
//   quantity: 1,
//   price: 10000,
//   recvWindow: 5000,
// };

// sendRequest('post', '/api/v3/order', order)
//   .then(data => console.log(data))
//   .catch(error => console.error(error));

// Check open orders
// sendRequest('get', '/api/v3/openOrders', {
//   symbol: 'BTCUSDT', // Replace with your symbol
//   recvWindow: 5000
// })
//   .then(data => console.log('Open orders:', data))
//   .catch(error => console.error(error));

// // Check order history
// sendRequest('get', '/api/v3/allOrders', {
//   symbol: 'BTCUSDT', // Replace with your symbol
//   recvWindow: 5000
// })
//   .then(data => console.log('Order history:', data))
//   .catch(error => console.error(error));
