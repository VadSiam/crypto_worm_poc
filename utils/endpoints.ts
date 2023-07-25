interface IOrder {
  symbol: string,
  side: string,
  type: string,
  timeInForce: string,
  quantity?: number,
  price?: number,
  recvWindow?: number,
};

const getOpenOrders = async () => {
  try {
    const res = await fetch('/api/openOrders');
    console.log('🚀 ~ file: endpoints.ts:14 ~ res:', res)
    if (res.ok) {
      const json = await res.json();
      return json;
    } else {
      console.error(`Some error at getOpenOrders: ${res.statusText}`);
      return null;
    }
  } catch (error) {
    console.error(`Error at getOpenOrders: ${error}`);
    return null;
  }
};

const makeOrder = async (order) => {
  try {
    const res = await fetch('/api/makeOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    if (res.ok) {
      const json = await res.json();
      return json;
    } else {
      console.error(`Some error at makeOrder: ${res.statusText}`);
      return null;
    }
  } catch (error) {
    console.error(`Error at makeOrder: ${error}`);
    return null;
  }
};


const cancelAllOpenOrders = async (symbol: string) => {
  try {
    const res = await fetch('/api/cancelOrders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symbol: symbol,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      return json;
    } else {
      console.error(`Some error at cancelAllOpenOrders: ${res.statusText}`);
      return null;
    }
  } catch (error) {
    console.error(`Error at cancelAllOpenOrders: ${error}`);
    return null;
  }
};


export { getOpenOrders, makeOrder, cancelAllOpenOrders };