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

const getBiggerNumberFirst = (num1: number, num2: number) => {
  if (num1 > num2) {
    return [num1, num2];
  } else {
    return [num2, num1];
  }
}

export interface IVolume {
  [key: string]: number
}
const convertArrayToObject = (arr: string[][]): IVolume[] => {
  return arr.reduce((result, subArr) => {
    const key = Math.round(+subArr[0] / 2) * 2; // Round the first number to the nearest even number
    const value = parseFloat(subArr[1]);
    const obj = {};
    obj[key] = value;
    result.push(obj);
    return result;
  }, [{}]);
}

const getLimitedValue = (obj?: IVolume) => {
  // Retrieve the first value from the object
  const value = (obj && Object.values(obj)?.[0]) ?? 0;

  // Return the value or 1 if the value is greater than 1
  return value > 1 ? 1 : value;
}

export {
  generateTicksTrade,
  roundToNearestEvenInteger,
  weightedAverage,
  getBiggerNumberFirst,
  convertArrayToObject,
  getLimitedValue,
}