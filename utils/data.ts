export interface AnimalHead {
  id: string;
  img: string;
  bodyColor: string;
  positionX?: number
  positionY?: number
  backgroundImg?: string;
  patternLine?: string;
}

export interface CryptoPair {
  label: string
  value: string
}

export const Y_UP_AND_DOWN_DIAPASON = 0.002 // 0.2%
export const TRADE_DIAPASON = 0.002 // 0.2%
export const TICKS_TRADE = 100
export const TICKS_TRADE_ETH = 10
export const TICKS_STEP_INTERVAL = 2 // in points
export const TICKS_STEP_INTERVAL_ETH = 0.1 // in points
export const ONE_GRID_VALUE = 40 // USDT

export const marginChart = { top: 20, right: 10, bottom: 20, left: 50 };
export const widthChart = 900 - marginChart.left - marginChart.right;
export const heightChart = 700 - marginChart.top - marginChart.bottom;

export const heads: AnimalHead[] = [
  {
    id: 'Worm',
    img: '/images/head/worm.png',
    bodyColor: '#f68974',
    positionY: -42,
    positionX: -20,
    backgroundImg: '/images/background/worm_back.png',
    patternLine: '/images/bricks/mushPattern.svg',
  },
  {
    id: 'Dragon',
    img: '/images/head/dragon.png',
    bodyColor: '#17638c',
    backgroundImg: '/images/background/dragon_back.png',
    patternLine: '/images/bricks/chickenPattern.svg',
  },
  {
    id: 'Frog',
    img: '/images/head/frog.png',
    bodyColor: '#717f2a',
    backgroundImg: '/images/background/frog_back.png',
    patternLine: '/images/bricks/mosqPattern.svg',
  },
]

export const cryptoPairs: CryptoPair[] = [
  {
    label: 'BTC-USDT',
    value: 'btcusdt',
  },
  {
    label: 'ETH-USDT',
    value: 'ethusdt',
  },
  {
    label: 'BTC-ETH',
    value: 'btceth',
  },
]