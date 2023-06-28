import * as d3 from 'd3';
import { DataPoint } from "..";
import { generateTicksTrade, roundToNearestEvenInteger } from '../../../utils/helpers';
import { AnimalHead, TICKS_STEP_INTERVAL, TICKS_STEP_INTERVAL_ETH, TICKS_TRADE, TICKS_TRADE_ETH, TRADE_DIAPASON, heightChart, marginChart, widthChart } from '../../../utils/data';

interface IDrawChart {
  data: DataPoint[][],
  ticks: number[],
  setTicks: React.Dispatch<React.SetStateAction<number[]>>,
  setLines: React.Dispatch<React.SetStateAction<any[]>>,
  setOrders: React.Dispatch<React.SetStateAction<string[]>>,
  animal: AnimalHead,
  ref: React.RefObject<SVGSVGElement>
  activePair: string
}

export const drawChart = ({
  data,
  ticks,
  setTicks,
  setLines,
  setOrders,
  animal,
  ref,
  activePair,
}: IDrawChart) => {
  const [dataBTC, dataETH, dataMIX] = data;
  const activeData = activePair === 'btcusdt'
    ? dataBTC
    : activePair === 'ethusdt' ? dataETH : dataMIX;
  if (activeData.length && ref.current) {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear the SVG to prevent duplicate elements

    const g = svg.append("g")
      .attr("transform", `translate(${marginChart.left},${marginChart.top})`);
    const xScale = d3.scaleTime().range([0, widthChart]);
    const yScale = d3.scaleLinear().range([heightChart, 0]);
    const line = d3.line<DataPoint>()
      .curve(d3.curveBasis)
      .x(d => xScale(new Date(d.timestamp)))
      .y(d => yScale(d.priceAvg));

    xScale.domain(d3.extent(activeData, d => new Date(d.timestamp)));

    // Adjust the yScale domain based on the latest data point
    const latestPriceAvg = activeData[activeData.length - 1].priceAvg;
    yScale.domain([latestPriceAvg - (activePair === 'btcusdt' ? TICKS_TRADE : TICKS_TRADE_ETH) / 2, latestPriceAvg + (activePair === 'btcusdt' ? TICKS_TRADE : TICKS_TRADE_ETH) / 2]); // Adjust the range as needed

    // xAxis at bottom
    g.append('g')
      .attr('transform', `translate(0,${heightChart})`)
      .call(d3.axisBottom(xScale));

    // Calculate the tick values
    // Add horizontal grid lines
    const tickValues = ticks
    setTicks(state => {
      const [newArrayTicks, fullArrayTicks] = generateTicksTrade({
        ticks: (activePair === 'btcusdt' ? TICKS_TRADE : TICKS_TRADE_ETH),
        step: (activePair === 'btcusdt' ? TICKS_STEP_INTERVAL : TICKS_STEP_INTERVAL_ETH),
        priceAvg: latestPriceAvg,
        existedTicks: state,
      })
      return fullArrayTicks;
    })

    const yAxis = g.append('g')
      .call(d3.axisLeft(yScale)
        .tickValues(tickValues)
        .tickSize(-widthChart)
        .tickFormat(() => '')
      );

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(activePair === 'btcusdt' ? 10 : 1)); // Add ticks to the Y-axis


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
        // console.log(`Mouse entered on line with id: ${d3.select(this).attr('id')}`);
      })
      .on('mouseleave', function (event, d) {
        d3.select(this).attr('stroke', 'pink')
          .attr('stroke-opacity', 0.3);
        // Handle mouse leave event
        // console.log(`Mouse left on line with id: ${d3.select(this).attr('id')}`);
      })
      .on('click', function (event, d) {
        const clickedId = d3.select(this).attr('id');
        let pairOrder = '';
        if (+clickedId >= latestPriceAvg) { // if it's ask order, making bid order
          const bidOrder = roundToNearestEvenInteger(+clickedId * (1 - TRADE_DIAPASON))
          pairOrder = `${bidOrder}`;
        } else { // it's bid order, making ask order
          const askOrder = roundToNearestEvenInteger(+clickedId * (1 + TRADE_DIAPASON))
          pairOrder = `${askOrder}`;
        }
        const rect = (this as SVGGraphicsElement).getBoundingClientRect();
        setOrders(state => {
          const isNew = !state.includes(clickedId)

          return isNew ? [...state, clickedId, pairOrder] : state;
        })
        // Handle click event
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
      .datum(activeData)
      .attr('fill', 'none')
      .attr('stroke', animal.bodyColor)
      .attr('stroke-width', 40)
      .attr('d', line);

    // HEAD. Append an image element to the SVG
    g.append('image')
      .attr('xlink:href', animal.img) // The URL of the image
      .attr('x', xScale(new Date(activeData[activeData.length - 1].timestamp)) - 35) // Position the image
      .attr('y', yScale(activeData[activeData.length - 1].priceAvg) - 60) // Position the image
      .attr('width', 100) // The width of the image
      .attr('height', 100); // The height of the image

  }
};
