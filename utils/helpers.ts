interface IGenerateTicksTrade {
  ticks: number, 
  step: number, 
  priceAvg: number
  existedTicks: number[]
}

const generateTicksTrade = ({ ticks, step, priceAvg, existedTicks }: IGenerateTicksTrade): number[][] => {
  const halfTicks = Math.floor(ticks / 2);
  const result: number[] = [];
  const roundPriceAvg = roundToNearestEvenInteger(priceAvg)

  for (let i = -halfTicks; i <= halfTicks; i++) {
    const newTick = roundPriceAvg + (i * step)
    if (!existedTicks.includes(newTick)) {
      result.push(newTick);
    }
  }

  const fullArray = [...existedTicks, ...result];
  return [result, fullArray];
}

const roundToNearestEvenInteger = (priceAvg: number): number => {
  let rounded = Math.round(priceAvg);
  return rounded % 2 === 0 ? rounded : rounded - 1;
}

const weightedAverage = (array: string[][]) => {
  const sumData = array.reduce((acc, curr) => {
    const [number, value] = curr.map(Number);
    if (value !== 0) {
      acc.sum += number * value;
      acc.sumWeights += value;
    }
    return acc;
  }, { sum: 0, sumWeights: 0 });

  return sumData.sumWeights !== 0 ? sumData.sum / sumData.sumWeights : 0;
}

export { generateTicksTrade, roundToNearestEvenInteger, weightedAverage }