const getOpenOrders = async () => {
  try {
    const res = await fetch('/api/binance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: 'GET', // or 'POST'
        endpoint: 'openOrders', // endpoint in the Binance API
        params: {
          symbol: 'BTCUSDT', // Replace with your symbol
          recvWindow: 5000
        }, // parameters for the request
      }),
    });

    if (res.ok) {
      const json = await res.json();
      return json;
    } else {
      console.error(`Some error at getOpenOrders: ${res}`)
      return null
    }
  } catch (error) {
    console.error(`Error at getOpenOrders: ${error}`)
    return null
  }
};

interface IOrder {
  symbol: string,
  side: string,
  type: string,
  timeInForce: string,
  quantity?: number,
  price?: number,
  recvWindow?: number,
};

const makeOrder = async (params: IOrder) => {
  try {
    const res = await fetch('/api/binance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: 'POST',
        endpoint: 'newOrder',
        params: {
          ...params,
          timestamp: Date.now(),
        },
      }),
    });

    if (res.ok) {
      const json = await res.json();
      return json;
    } else {
      console.error(`Some error at makeOrder: ${JSON.stringify(res)}`)
      return null
    }
  } catch (error) {
    console.error(`Error at makeOrder: ${error}`)
    return null
  }
};

const cancelAllOpenOrders = async (symbol: string) => {
  try {
    const res = await fetch('/api/binance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: 'DELETE',
        endpoint: 'openOrders', // Change to 'openOrders'
        params: {
          symbol: symbol,
          timestamp: Date.now(),
        },
      }),
    });

    if (res.ok) {
      const json = await res.json();
      return json;
    } else {
      console.error(`Some error at cancelAllOpenOrders: ${res.statusText}`)
      return null
    }
  } catch (error) {
    console.error(`Error at cancelAllOpenOrders: ${error}`)
    return null
  }
};

const cancelAllOpenOrdersOneByOne = async (symbol: string) => {
  try {
    const res = await fetch('/api/binance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: 'GET_AND_DELETE',  // use 'GET_AND_DELETE'
        endpoint: 'getOpenOrders', // change to 'getOpenOrders'
        params: {
          symbol: symbol,
          timestamp: Date.now(),
        },
      }),
    });

    if (res.ok) {
      const json = await res.json();
      console.log('🚀 ~ file: endpoints.ts:90 ~ json:', json)
      return json;
    } else {
      console.error(`Some error at cancelAllOpenOrders: ${res.statusText}`)
      return null
    }
  } catch (error) {
    console.error(`Error at cancelAllOpenOrders: ${error}`)
    return null
  }
};


export { getOpenOrders, makeOrder, cancelAllOpenOrders, cancelAllOpenOrdersOneByOne };