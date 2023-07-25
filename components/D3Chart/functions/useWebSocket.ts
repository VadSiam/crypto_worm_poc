import { useEffect, useState } from 'react';
import { convertArrayToObject } from '../../../utils/helpers';

export const useWebSocket = () => {
  const [volumes, setVolumes] = useState([]);
  const [dataBTC, setBTCData] = useState([]);
  const [dataETH, setETHData] = useState([]);
  const [dataMIX, setMIXData] = useState([]);

  useEffect(() => {
    const streams = 'btcusdt@depth/ethusdt@depth';
    // const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);
    const ws = new WebSocket(`wss://testnet.binance.vision/stream?streams=${streams}`);
    // 'wss://testnet.binance.vision/ws/btcusdt@depth' // test net


    ws.onmessage = (message) => {
      const response = JSON.parse(message.data);
      const { stream, data: { a, b, E } } = response;
      const [ask1 = [], bid1 = []] = [a[0], b[0]];
      const timestamp = new Date(E);
      const priceAsk1 = parseFloat(ask1[0]);
      const priceBid1 = parseFloat(bid1[0]);
      const priceAvg = (priceAsk1 && priceBid1)
        ? (priceAsk1 + priceBid1) / 2
        : (priceAsk1 || priceBid1);

      setVolumes(state => {
        const newVolumes = convertArrayToObject([...a, ...b]);
        const mergedVolumes = state.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        newVolumes.forEach(vol => {
          const key = Object.keys(vol)[0];
          mergedVolumes[key] = vol[key];
        });
        const result = Object.keys(mergedVolumes).map(key => ({ [key]: mergedVolumes[key] }));
        return result;
      })

      if (stream === 'btcusdt@depth') {
        setBTCData(prevData => [
          ...prevData.slice(-40),
          { timestamp, priceAvg },
        ]);
        let lastDataETH = 0;
        setETHData(state => {
          lastDataETH = state[state.length - 1]?.priceAvg;
          if (!!lastDataETH) {
            setMIXData(prevData => [
              ...prevData.slice(-40),
              { timestamp, priceAvg: priceAvg / lastDataETH },
            ]);
          }
          return state;
        })
      } else if (stream === 'ethusdt@depth') {
        setETHData(prevData => [
          ...prevData.slice(-40),
          { timestamp, priceAvg },
        ]);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return { volumes, dataBTC, dataETH, dataMIX };
}
