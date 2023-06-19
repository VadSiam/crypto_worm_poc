export interface AnimalHead {
  id: string;
  img: string;
  bodyColor: string;
  positionX?: number
  positionY?: number
}

export const heads: AnimalHead[] = [
  {
    id: 'Worm',
    img: '/images/head/worm.png',
    bodyColor: '#f68974',
    positionY: -42,
    positionX: -20,
  },
  {
    id: 'Dragon',
    img: '/images/head/dragon.png',
    bodyColor: '#17638c',
  },
  {
    id: 'Frog',
    img: '/images/head/frog.png',
    bodyColor: '#717f2a',
  },
]
