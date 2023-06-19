import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
  ReferenceLine,
  ReferenceDot,
  Label,
} from 'recharts';
import { generateTicksTrade, roundToNearestEvenInteger, weightedAverage } from '../utils/helpers';
import ReconnectingWebSocket from 'reconnecting-websocket';
import ReferenceLinesGrid from './ReferenceLinesGrid';
import { getOpenOrders, makeOrder } from '../utils/endpoints';
import styled, { keyframes } from 'styled-components';
import { CustomHead } from './CustomHead';
import SimpleSelect from './Select';
import { AnimalHead, heads } from '../utils/data';
import AnimatedBack from './AnimatedBack';

const StyledResponsiveContainer = styled(ResponsiveContainer)`
  svg {
    width: 110% !important;
  }
`;

interface ChartData {
  timestamp: string;
  priceAvg: number;
  domain: number[];
}

const Y_UP_AND_DOWN_DIAPASON = 0.002 // 0.2%
const TRADE_DIAPASON = 0.002 // 0.2%
const TICKS_TRADE = 100
const TICKS_STEP = 2 // in points
const ONE_GRID_VALUE = 40 // USDT

const LiveChart: React.FC = () => {
  const [activeHead, setHead] = useState<string>(heads[0].id);
  const [data, setData] = useState<ChartData[]>([]);
  const [domain, setDomain] = useState<number[]>([]);
  const [ticks, setTicks] = useState<number[]>([]);
  const [orders, setOrders] = useState<number[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const resp = await getOpenOrders()
      const ordersFromMarket = resp.map(o => roundToNearestEvenInteger(o.price))
      setOrders(ordersFromMarket)
    };

    setInterval(() => {
      fetch()
    }, 2000);
  }, [])

  const clickOnLine = async (num: number) => {
    console.log('CLICK', num)
    const { priceAvg } = data.slice(-1)[0];
    const oneGridInBTC = +(ONE_GRID_VALUE / priceAvg).toFixed(6)
    console.log('🚀 ~ file: LiveChart.tsx:57 ~ oneGridInBTC:', oneGridInBTC)
    if (num >= priceAvg) {
      const bidOrder = roundToNearestEvenInteger(num * (1 - TRADE_DIAPASON))
      const resp = await Promise.all([num, bidOrder].map(async (order, idx) => {
        console.log('🚀 ~ file: LiveChart.tsx:70 ~ !idx ? ', idx, !idx ? 'SELL' : 'BUY',)
        return await makeOrder({
          symbol: 'BTCUSDT',
          side: !idx ? 'SELL' : 'BUY',
          type: 'LIMIT',
          timeInForce: 'GTC',
          quantity: oneGridInBTC,
          price: order,
          recvWindow: 5000,
        })
      }))
      console.log('🚀 ~ file: UP ~ resp:', resp)
      if (resp[0] && resp[1]) {
        setOrders(state => [...state, num, bidOrder])
      }
    } else {
      const askOrder = roundToNearestEvenInteger(num * (1 + TRADE_DIAPASON))
      const resp = await Promise.all([num, askOrder].map(async (order, idx) => {
        return await makeOrder({
          symbol: 'BTCUSDT',
          side: idx ? 'SELL' : 'BUY',
          type: 'LIMIT',
          timeInForce: 'GTC',
          quantity: oneGridInBTC,
          price: order,
          recvWindow: 5000,
        })
      }))
      console.log('🚀 ~ file: down resp:', resp)
      if (resp[0] && resp[1]) {
        setOrders(state => [...state, num, askOrder])
      }
    }
  }

  useEffect(() => {
    const ws = new ReconnectingWebSocket(
      // 'wss://testnet.binance.vision/ws/btcusdt@depth' // test net
      'wss://stream.binance.com:9443/ws/btcusdt@depth'
    );

    ws.onmessage = (message) => {
      const response = JSON.parse(message.data);
      const { a, b, E } = response;
      const [ask1 = [], ask2 = [], ask3 = []] = a;
      const [bid1 = [], bid2 = [], bid3 = []] = b;
      const timestamp = new Date(E).toLocaleTimeString();
      const priceAsk1 = parseFloat(ask1[0]);
      const priceBid1 = parseFloat(bid1[0]);
      const priceAvgSimple = (priceAsk1 && priceBid1)
        ? (priceAsk1 + priceBid1) / 2
        : (priceAsk1 || priceBid1);

      const priceAvgWithWeight = weightedAverage([[ask1], [ask2], [ask3], [bid1], [bid2], [bid3]])

      const priceAvg = priceAvgWithWeight || priceAvgSimple

      const [newArrayTicks, fullArrayTicks] = generateTicksTrade({
        ticks: TICKS_TRADE,
        step: TICKS_STEP,
        priceAvg,
        existedTicks: ticks,
      })
      setTicks(fullArrayTicks)

      const domain = [
        Math.floor((1 - Y_UP_AND_DOWN_DIAPASON) * priceAvg),
        Math.ceil((1 + Y_UP_AND_DOWN_DIAPASON) * priceAvg)
      ];

      setDomain(domain);

      setData((prevData) => [
        ...prevData.slice(-40),
        {
          timestamp,
          priceAvg,
          domain,
        },
      ]);
    };

    return () => {
      ws.close();
    };
  }, []);

  const lastDataPoint = data[data.length - 1];

  return (
    <div style={{ width: '900px', height: '800px' }}>
      Open orders: {orders.length}
      <br />
      <br />
      <SimpleSelect
        defaultHead={activeHead}
        setHead={setHead}
      />
      <br />
      <br />
      {heads.map(head => (
        (activeHead === head.id) && (
          <AnimatedBack
            key={head.id}
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <StyledResponsiveContainer
              width="100%"
              height="100%"
            >
              <ComposedChart data={data} style={{ marginLeft: '-94px' }}>
                <XAxis dataKey="timestamp" />
                <YAxis
                  domain={domain}
                // domain={['auto', 'auto']}
                />

                <Legend />
                <ReferenceLinesGrid
                  ticks={ticks}
                  orders={orders}
                  clickOn={clickOnLine}
                />
                <Line
                  type="monotone"
                  dataKey="priceAvg"
                  stroke={head.bodyColor}
                  strokeWidth={30}
                />
                {lastDataPoint && (
                  <ReferenceDot
                    x={lastDataPoint.timestamp}
                    y={lastDataPoint.priceAvg}
                  >
                    <Label content={<CustomHead
                      imgHead={head.img}
                      x={head.positionX}
                      y={head.positionY}
                    />} />
                  </ReferenceDot>
                )}
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  horizontalCoordinatesGenerator={(props) => {
                    const gridStep = (TRADE_DIAPASON / 2) / Y_UP_AND_DOWN_DIAPASON
                    const { height } = props;
                    const upLine = Math.floor(height / 2 * (1 + gridStep))
                    const downLine = Math.floor(height / 2 * (1 - gridStep))
                    return height ? [upLine, downLine] : []
                  }}
                />

              </ComposedChart>
            </StyledResponsiveContainer>
          </AnimatedBack>
        )
      ))}
    </div>
  );
};

export default LiveChart;
