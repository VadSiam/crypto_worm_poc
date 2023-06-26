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
export const TICKS_STEP_INTERVAL = 2 // in points
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
    backgroundImg: 'https://cdn.discordapp.com/attachments/1092399713757708378/1121357088422109254/vad_siam_underground_landscape_with_soil_and_stones__cartoon_st_4ac085e6-ca8f-42f4-9def-2d7632a43ae8.png',
    patternLine: '/images/bricks/mushPattern.svg',
  },
  {
    id: 'Dragon',
    img: '/images/head/dragon.png',
    bodyColor: '#17638c',
    backgroundImg: 'https://cdn.discordapp.com/attachments/1092399713757708378/1120287817164148816/vad_siam_clouds_and_trees_cartoon_style_101da6cf-e17a-4c69-8e10-36f0f71fdf84.png',
    patternLine: '/images/bricks/chickenPattern.svg',
  },
  {
    id: 'Frog',
    img: '/images/head/frog.png',
    bodyColor: '#717f2a',
    backgroundImg: 'https://cdn.discordapp.com/attachments/1092399713757708378/1121355916764254268/vad_siam_underwater_landscape_with_stones_and_plants_cartoon_st_f2128185-185e-42af-844f-85d68327a103.png',
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