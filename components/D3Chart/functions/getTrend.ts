import { DataPoint } from "..";


const getTrend = (items: DataPoint[]): number => {
  // Make sure there are at least 2 items to compare
  if (items.length < 2) {
    return 0;
  }

  const firstPrice = items[0].priceAvg;
  const lastPrice = items[items.length - 1].priceAvg;

  const difference = lastPrice - firstPrice;
  const percentChange = (difference / firstPrice) * 100;

  // Define the thresholds for each category
  if (percentChange > 0.01) {
    return -45; // Very steep upward trend
  } else if (percentChange > 0.001) {
    return -30; // Steep upward trend
  } else if (percentChange > 0.0001) {
    return -15; // Mild upward trend
  } else if (percentChange > -0.0001) {
    return 0; // Stable
  } else if (percentChange > -0.001) {
    return 15; // Mild downward trend
  } else if (percentChange > -0.01) {
    return 30; // Steep downward trend
  } else {
    return 45; // Very steep downward trend
  }
}

export { getTrend }