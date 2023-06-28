import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';
import AnimatedBackground from '../AnimatedBackground';
import { generateTicksTrade } from '../../utils/helpers';
import AnimalSelect from '../AnimalSelect';
import { cryptoPairs, heads, heightChart, marginChart, widthChart } from '../../utils/data';
import PairSelect from '../PairSelect';
import { SelectContainer } from './styles';
import { drawChart } from './functions/drawChart';


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

const LineD3Chart: React.FC = () => {
  const [activeHead, setHead] = useState<string>(heads[0].id);
  const [activePair, setPair] = useState<string>(cryptoPairs[0].value);
  const ref = useRef<SVGSVGElement>(null);
  const [dataBTC, setBTCData] = useState<DataPoint[]>([]);
  const [dataETH, setETHData] = useState<DataPoint[]>([]);
  const [dataMIX, setMIXData] = useState<DataPoint[]>([]);
  const [lines, setLines] = useState([])
  const [ticks, setTicks] = useState<number[]>([]);
  const [orders, setOrders] = useState<string[]>([]);
  const animal = heads.find(h => h.id === activeHead)


  useEffect(() => {
    const streams = 'btcusdt@depth/ethusdt@depth';
    // const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);
    const ws = new WebSocket(`wss://testnet.binance.vision/stream?streams=${streams}`); // test net

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

  useEffect(() => {
    drawChart({ data: [dataBTC, dataETH, dataMIX], ticks, setTicks, setLines, setOrders, animal, ref, activePair });
  }, [dataBTC, dataETH]);


  useEffect(() => {
    // add pattern to orders lines
    const svgInject = d3.select('svg');
    orders.forEach(order => {
      // Pattern line
      const findLine = lines.find(l => l.id === order);

      svgInject.append('image')
        .attr('href', animal.patternLine)
        .attr('x', marginChart.left)
        .attr('y', findLine?.y - 194) // TODO can't get where this diff -194 is coming. Size of screen has effect, height of injected image (if exist)
        .attr('width', widthChart)
      // .attr('height', 140)
    });
  }, [orders, lines])


  return (
    <div style={{
      width: widthChart + 100,
      height: heightChart + 100,
      textAlign: 'center',
      margin: 'auto',
    }}>
      <h1>Live Crypto Chart: BTC-USDT</h1>
      <SelectContainer>
        <div>
          <h3>Choose your animal</h3>
          <AnimalSelect
            defaultHead={activeHead}
            setHead={setHead}
          />
        </div>
        <div>
          <h3>Choose your crypto pair</h3>
          <PairSelect
            defaultPair={activePair}
            setPair={setPair}
          />
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
