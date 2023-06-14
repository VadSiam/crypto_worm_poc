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
import styled from 'styled-components';

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
  const [data, setData] = useState<ChartData[]>([]);
  console.log('🚀 ~ file: LiveChart.tsx:42 ~ data:', data)
  const [domain, setDomain] = useState<number[]>([]);
  const [ticks, setTicks] = useState<number[]>([]);
  const [orders, setOrders] = useState<number[]>([]);
  console.log('🚀 ~ file: LiveChart.tsx:43 ~ orders:', orders)

  useEffect(() => {
    const fetch = async () => {
      const resp = await getOpenOrders()
      console.log('🚀 ~ file: LiveChart.tsx:46 ~ resp:', resp)
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

  const CustomImageLabel = (props) => {
    const { viewBox } = props;
    return (
      <g transform={`translate(${viewBox.x},${viewBox.y})`}>
        <image
          x={-30}
          y={-32}
          width="80"
          height="80"
          xlinkHref="/images/head/dragon.png"
        />
      </g>
    );
  };

  return (
    <div style={{ width: '900px', height: '800px' }}>
      Open orders: {orders.length}
      <br />
      <br />
      <div style={{ width: '100%', height: '100%' }}>
        <StyledResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <XAxis dataKey="timestamp" />
            <YAxis
              domain={domain}
            // domain={['auto', 'auto']}
            />

            {/* <Tooltip /> */}
            <Legend />
            <ReferenceLinesGrid
              ticks={ticks}
              orders={orders}
              clickOn={clickOnLine}
            />
            <Line
              type="monotone"
              dataKey="priceAvg"
              stroke="#b169bb"
              strokeWidth={30}
            />
            {lastDataPoint && (
              <ReferenceDot
                x={lastDataPoint.timestamp}
                y={lastDataPoint.priceAvg}
              >
                <Label content={<CustomImageLabel />} />
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
      </div>
    </div>
  );
};

export default LiveChart;

const Data = [
  {
    "timestamp": "6:05:08 PM",
    "priceAvg": 25967.775,
    "domain": [
      25915,
      26020
    ]
  },
  {
    "timestamp": "6:05:09 PM",
    "priceAvg": 25967.775,
    "domain": [
      25915,
      26020
    ]
  },
  {
    "timestamp": "6:05:10 PM",
    "priceAvg": 25967.775,
    "domain": [
      25915,
      26020
    ]
  },
  {
    "timestamp": "6:05:11 PM",
    "priceAvg": 25967.775,
    "domain": [
      25915,
      26020
    ]
  },
  {
    "timestamp": "6:05:12 PM",
    "priceAvg": 25967.775,
    "domain": [
      25915,
      26020
    ]
  },
  {
    "timestamp": "6:05:13 PM",
    "priceAvg": 25967.775,
    "domain": [
      25915,
      26020
    ]
  },
  {
    "timestamp": "6:05:14 PM",
    "priceAvg": 25967.775,
    "domain": [
      25915,
      26020
    ]
  },
  {
    "timestamp": "6:05:15 PM",
    "priceAvg": 25967.775,
    "domain": [
      25915,
      26020
    ]
  },
  {
    "timestamp": "6:05:16 PM",
    "priceAvg": 25967.775,
    "domain": [
      25915,
      26020
    ]
  },
  {
    "timestamp": "6:05:17 PM",
    "priceAvg": 25967.775,
    "domain": [
      25915,
      26020
    ]
  },
  {
    "timestamp": "6:05:18 PM",
    "priceAvg": 25967.775,
    "domain": [
      25915,
      26020
    ]
  },
  {
    "timestamp": "6:05:19 PM",
    "priceAvg": 25968.72,
    "domain": [
      25916,
      26021
    ]
  },
  {
    "timestamp": "6:05:20 PM",
    "priceAvg": 25969.665,
    "domain": [
      25917,
      26022
    ]
  },
  {
    "timestamp": "6:05:21 PM",
    "priceAvg": 25969.665,
    "domain": [
      25917,
      26022
    ]
  },
  {
    "timestamp": "6:05:22 PM",
    "priceAvg": 25969.665,
    "domain": [
      25917,
      26022
    ]
  },
  {
    "timestamp": "6:05:23 PM",
    "priceAvg": 25969.665,
    "domain": [
      25917,
      26022
    ]
  },
  {
    "timestamp": "6:05:24 PM",
    "priceAvg": 25969.665,
    "domain": [
      25917,
      26022
    ]
  },
  {
    "timestamp": "6:05:25 PM",
    "priceAvg": 25969.665,
    "domain": [
      25917,
      26022
    ]
  },
  {
    "timestamp": "6:05:26 PM",
    "priceAvg": 25967.405,
    "domain": [
      25915,
      26020
    ]
  },
  {
    "timestamp": "6:05:27 PM",
    "priceAvg": 25965.145,
    "domain": [
      25913,
      26018
    ]
  },
  {
    "timestamp": "6:05:28 PM",
    "priceAvg": 25965.145,
    "domain": [
      25913,
      26018
    ]
  },
  {
    "timestamp": "6:05:29 PM",
    "priceAvg": 25962.555,
    "domain": [
      25910,
      26015
    ]
  },
  {
    "timestamp": "6:05:30 PM",
    "priceAvg": 25959.965,
    "domain": [
      25908,
      26012
    ]
  },
  {
    "timestamp": "6:05:31 PM",
    "priceAvg": 25959.965,
    "domain": [
      25908,
      26012
    ]
  },
  {
    "timestamp": "6:05:32 PM",
    "priceAvg": 25959.965,
    "domain": [
      25908,
      26012
    ]
  },
  {
    "timestamp": "6:05:33 PM",
    "priceAvg": 25959.965,
    "domain": [
      25908,
      26012
    ]
  },
  {
    "timestamp": "6:05:34 PM",
    "priceAvg": 25959.965,
    "domain": [
      25908,
      26012
    ]
  },
  {
    "timestamp": "6:05:35 PM",
    "priceAvg": 25959.965,
    "domain": [
      25908,
      26012
    ]
  },
  {
    "timestamp": "6:05:36 PM",
    "priceAvg": 25959.965,
    "domain": [
      25908,
      26012
    ]
  },
  {
    "timestamp": "6:05:37 PM",
    "priceAvg": 25959.965,
    "domain": [
      25908,
      26012
    ]
  },
  {
    "timestamp": "6:06:30 PM",
    "priceAvg": 25956.835,
    "domain": [
      25904,
      26009
    ]
  },
  {
    "timestamp": "6:06:31 PM",
    "priceAvg": 25956.785,
    "domain": [
      25904,
      26009
    ]
  },
  {
    "timestamp": "6:06:32 PM",
    "priceAvg": 25956.785,
    "domain": [
      25904,
      26009
    ]
  },
  {
    "timestamp": "6:06:33 PM",
    "priceAvg": 25956.785,
    "domain": [
      25904,
      26009
    ]
  },
  {
    "timestamp": "6:06:34 PM",
    "priceAvg": 25955.894999999997,
    "domain": [
      25903,
      26008
    ]
  },
  {
    "timestamp": "6:06:35 PM",
    "priceAvg": 25955.004999999997,
    "domain": [
      25903,
      26007
    ]
  },
  {
    "timestamp": "6:06:36 PM",
    "priceAvg": 25955.004999999997,
    "domain": [
      25903,
      26007
    ]
  },
  {
    "timestamp": "6:06:37 PM",
    "priceAvg": 25955.004999999997,
    "domain": [
      25903,
      26007
    ]
  },
  {
    "timestamp": "6:06:38 PM",
    "priceAvg": 25955.625,
    "domain": [
      25903,
      26008
    ]
  },
  {
    "timestamp": "6:06:39 PM",
    "priceAvg": 25955.004999999997,
    "domain": [
      25903,
      26007
    ]
  },
  {
    "timestamp": "6:06:40 PM",
    "priceAvg": 25955.004999999997,
    "domain": [
      25903,
      26007
    ]
  }
]