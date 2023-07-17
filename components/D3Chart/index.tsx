import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';
import AnimatedBackground from '../AnimatedBackground';
import { ONE_GRID_VALUE, cryptoPairs, heads, heightChart, marginChart, widthChart } from '../../utils/data';
import PairSelect from '../PairSelect';
import { SelectContainer, StyledH1 } from './styles';
import { drawChart } from './functions/drawChart';
import { AnimalSelectCircle } from '../AnimalSelectCircle';
import { getBiggerNumberFirst, roundToNearestEvenInteger } from '../../utils/helpers';
import { getOpenOrders, makeOrder } from '../../utils/endpoints';
import { CancelAllOpenOrders } from './CancelAllOrders';
import { useWebSocket } from './functions/useWebSocket';


const StyledSvg = styled.svg`
  .grid line {
    stroke: url(#image);
    stroke-width: 20px;
  }
`;

export interface DataPoint {
  timestamp: Date;
  priceAvg: number;
}

const radius = 60;
const xCorrection = 2;
const yCorrection = -22;

const LineD3Chart: React.FC = () => {
  const [activeHead, setHead] = useState<string>(heads[0].id);
  const [activePair, setPair] = useState<string>(cryptoPairs[0].value);
  const ref = useRef<SVGSVGElement>(null);
  const [lines, setLines] = useState([])
  const [ticks, setTicks] = useState<number[]>([]);
  const [orders, setOrders] = useState<string[]>([]);
  const animal = heads.find(h => h.id === activeHead)
  const pairLabel = cryptoPairs.find(cp => cp.value === activePair)?.label

  useEffect(() => {
    const intervalFunction = setInterval(async () => {
      const resp = await getOpenOrders();
      const ordersFromMarket = resp?.map((o: { price: number }) => roundToNearestEvenInteger(o.price));
      if ((orders ?? []).length !== ordersFromMarket) {
        setOrders(ordersFromMarket);
      }
    }, 1000); // Checking every second

    return () => {
      clearInterval(intervalFunction); // Clear the interval on component unmount
    };
  }, [orders]);

  const saveAndSetOrders = async (newOrders: string[]) => {
    const [clickedId, pairOrder] = newOrders;
    const isNew = !orders.includes(clickedId)
    const { priceAvg } = dataBTC.slice(-1)[0];
    const oneGridInBTC = +(ONE_GRID_VALUE / priceAvg).toFixed(5)
    if (isNew) {
      const [askOrder, bidOrder] = getBiggerNumberFirst(+clickedId, +pairOrder);

      const resp = await Promise.all([askOrder, bidOrder].map(async (order, idx) => {
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
      console.log('🚀 ~ file: index.tsx:74 ~ resp:', resp)

      if (resp[0] && resp[1]) {
        // set to memory for future use
        const data = JSON.parse(sessionStorage.getItem('historyOrders') || '[]');
        sessionStorage.setItem('historyOrders', JSON.stringify([...data, [askOrder, bidOrder]]));
        // set to component state
        setOrders(state => [...state, clickedId, pairOrder])
      }
    }
  }

  const { volumes, dataBTC, dataETH, dataMIX } = useWebSocket();

  useEffect(() => {
    drawChart({ data: [dataBTC, dataETH, dataMIX], ticks, setTicks, setLines, saveAndSetOrders, animal, ref, activePair, volumes });
  }, [dataBTC, dataETH]);


  useEffect(() => {
    // add pattern to orders lines
    const svgInject = d3.select('svg');
    orders?.forEach(order => {
      // Pattern line
      const findLine = lines.find(l => l.id === `${order}`);

      if (findLine) {
        svgInject.append('image')
          .attr('href', animal.patternLine)
          .attr('x', marginChart.left)
          .attr('y', findLine?.y - 234) // TODO can't get where this diff -234 is coming. Size of screen has effect, height of injected image (if exist)
          .attr('width', widthChart + 110)
      }
    });
  }, [orders, lines])


  return (
    <div style={{
      width: widthChart + 300,
      height: heightChart + 100,
      textAlign: 'center',
      margin: 'auto',
    }}>
      <StyledH1>Live Crypto Chart: {`${pairLabel}`}</StyledH1>
      <SelectContainer>
        <div>
          <h3>Choose your animal</h3>
          <AnimalSelectCircle
            options={heads}
            defaultOption={animal}
            onChange={setHead}
            circleOptionsStyles={{
              radius,
              xCorrection,
              yCorrection,
            }}
          />
        </div>
        <div>
          <h3>Choose your crypto pair</h3>
          <PairSelect
            defaultPair={activePair}
            setPair={setPair}
          />
        </div>
        <div>
          <h3>Cancel</h3>
          <CancelAllOpenOrders setOrders={setOrders} />
        </div>
      </SelectContainer>
      <AnimatedBackground image={animal.backgroundImg}>
        <StyledSvg
          ref={ref}
          width={widthChart + marginChart.left + marginChart.right + 100}
          height={heightChart + marginChart.top + marginChart.bottom}
        />
      </AnimatedBackground>
    </div>
  );
};

export default LineD3Chart;
