import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';
import AnimatedBack from '../AnimatedBack';
import { generateTicksTrade } from '../../utils/helpers';
import SimpleSelect from '../Select';
import { heads } from '../../utils/data';

const Y_UP_AND_DOWN_DIAPASON = 0.002 // 0.2%
const TRADE_DIAPASON = 0.002 // 0.2%
const TICKS_TRADE = 100
const TICKS_STEP_INTERVAL = 2 // in points
const ONE_GRID_VALUE = 40 // USDT

const StyledSvg = styled.svg`
  .grid line {
    stroke: url(#image);
    stroke-width: 20px;
  }
`;

const margin = { top: 20, right: 10, bottom: 20, left: 50 };
const width = 900 - margin.left - margin.right;
const height = 700 - margin.top - margin.bottom;

interface DataPoint {
  timestamp: Date;
  priceAvg: number;
}

const LineD3Chart: React.FC = () => {
  const [activeHead, setHead] = useState<string>(heads[0].id);
  const ref = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<DataPoint[]>([]);
  const [lines, setLines] = useState([])
  const [ticks, setTicks] = useState<number[]>([]);
  const [orders, setOrders] = useState<string[]>([]);
  // console.log('🚀 ~ file: index.tsx:35 ~ orders:', orders, lines)
  const animal = heads.find(h => h.id === activeHead)


  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@depth');

    ws.onmessage = (message) => {
      const response = JSON.parse(message.data);
      const { a, b, E } = response;
      const [ask1 = [], bid1 = []] = [a[0], b[0]];
      const timestamp = new Date(E);
      const priceAsk1 = parseFloat(ask1[0]);
      const priceBid1 = parseFloat(bid1[0]);
      const priceAvg = (priceAsk1 && priceBid1)
        ? (priceAsk1 + priceBid1) / 2
        : (priceAsk1 || priceBid1);

      setData(prevData => [
        ...prevData.slice(-40),
        { timestamp, priceAvg },
      ]);
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    // add pattern to orders lines
    const svgInject = d3.select('svg');
    // console.log('🚀 ~ file: index.tsx:144 ~ svgInject:', lines)
    orders.forEach(order => {
      // Pattern line
      const findLine = lines.find(l => l.id === order);

      svgInject.append('image')
        .attr('href', '/images/bricks/mushPattern.svg')
        .attr('x', findLine?.x)
        .attr('y', findLine?.y - 164) // TODO can't get where this diff -164 is coming
        .attr('width', width)
      // .attr('height', 200);
    });
  },[orders, lines])

    
  useEffect(() => {
    if (data.length > 0) {
      const svg = d3.select(ref.current);
      svg.selectAll("*").remove(); // Clear the SVG to prevent duplicate elements

      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
      const xScale = d3.scaleTime().range([0, width]);
      const yScale = d3.scaleLinear().range([height, 0]);
      const line = d3.line<DataPoint>()
        .curve(d3.curveBasis)
        .x(d => xScale(new Date(d.timestamp)))
        .y(d => yScale(d.priceAvg));

      xScale.domain(d3.extent(data, d => new Date(d.timestamp)));

      // Adjust the yScale domain based on the latest data point
      const latestPriceAvg = data[data.length - 1].priceAvg;
      yScale.domain([latestPriceAvg - TICKS_TRADE / 2, latestPriceAvg + TICKS_TRADE / 2]); // Adjust the range as needed

      // xAxis at bottom
      g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

      // Calculate the tick values
      // Add horizontal grid lines
      const tickValues = ticks
      setTicks(state => {
        const [newArrayTicks, fullArrayTicks] = generateTicksTrade({
          ticks: TICKS_TRADE,
          step: TICKS_STEP_INTERVAL,
          priceAvg: latestPriceAvg,
          existedTicks: state,
        })
        return fullArrayTicks;
      })

      const yAxis = g.append('g')
        .call(d3.axisLeft(yScale)
          .tickValues(tickValues)
          .tickSize(-width)
          .tickFormat(() => '')
        );

      g.append('g')
        .call(d3.axisLeft(yScale).ticks(10)); // Add ticks to the Y-axis


      // Select the tick lines
      const tickLines = yAxis.selectAll('.tick line')
        .attr('stroke-width', 10)
        .attr('stroke', 'pink')
        .attr('stroke-opacity', 0.3);


      // Assign the id attribute to each line
      tickLines.attr('id', function (d, i) {
        // Get the current id
        const currentId = d3.select(this).attr('id');

        // If the id exists, return(assign) it, otherwise assign a new id
        return currentId ? currentId : tickValues[i];
      })
        .on('mouseenter', function (event, d) {
          d3.select(this).attr('stroke', 'green')
          .attr('stroke-opacity', 1)
          // Handle mouse enter event
          console.log(`Mouse entered on line with id: ${d3.select(this).attr('id')}`);
        })
        .on('mouseleave', function (event, d) {
          d3.select(this).attr('stroke', 'pink')
            .attr('stroke-opacity', 0.3);
          // Handle mouse leave event
          console.log(`Mouse left on line with id: ${d3.select(this).attr('id')}`);
        })
        .on('click', function (event, d) {
          const clickedId = d3.select(this).attr('id');
          const rect = (this as SVGGraphicsElement).getBoundingClientRect();
          console.log('🚀 ~ file: index.tsx:159 ~ this:', this, rect)
          setOrders(state => {
            const isNew = !state.includes(clickedId)

            return isNew ? [...state, clickedId] : state;
          })
          // Handle click event
          // console.log(`Line clicked with id: ${d3.select(this).attr('id')}`);
        });

      tickLines.each(function () {
        const rect = (this as SVGGraphicsElement).getBoundingClientRect();
        const id = d3.select(this).attr('id'); // Get the id attribute
        // console.log(`id: ${id}, x: ${rect.left}, y: ${rect.top}`);
        setLines(state => {
          const index = state.findIndex(line => line.id === id);
          if (index !== -1) {
            // If an object with the same id is found, create a new array where the object is updated
            return state.map(line => line.id === id ? { id, x: rect.left, y: rect.top } : line);
          } else {
            // If no object with the same id is found, append the new object to the end of the array
            return [...state, { id, x: rect.left, y: rect.y }];
          }
        });
      });

      // Body
      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', animal.bodyColor)
        .attr('stroke-width', 40)
        .attr('d', line);

      // HEAD. Append an image element to the SVG
      g.append('image')
        .attr('xlink:href', animal.img) // The URL of the image
        .attr('x', xScale(new Date(data[data.length - 1].timestamp)) - 35) // Position the image
        .attr('y', yScale(data[data.length - 1].priceAvg) - 60) // Position the image
        .attr('width', 100) // The width of the image
        .attr('height', 100); // The height of the image

    }
  }, [data]);

  return (
    <div style={{ width: width + 100, height: height + 100 }}>
      <h3>Choose your animal</h3>
      <SimpleSelect
        defaultHead={activeHead}
        setHead={setHead}
      />
      <br />
      <br />
      <AnimatedBack image={animal.backgroundImg}>
        <StyledSvg
          ref={ref}
          width={width + margin.left + margin.right + 100}
          height={height + margin.top + margin.bottom}
        />
      </AnimatedBack>
    </div>
  );
};

export default LineD3Chart;
