import { WongStrategy } from "../models-constants-enums/models";

export const wong2MoreSpots: WongStrategy = {
  title: '2 More Spots',
  wongedHands: [
    { enterAt: 3, exitBelow: 1, isActive: false },
    { enterAt: 4, exitBelow: 2, isActive: false },
  ]
};

export const wong3MoreSpots: WongStrategy = {
  title: '3 More Spots',
  wongedHands: [
    { enterAt: 3, exitBelow: 1, isActive: false },
    { enterAt: 4, exitBelow: 2, isActive: false },
    { enterAt: 5, exitBelow: 3, isActive: false },
  ]
};

export const wong1MoreSpot: WongStrategy = {
  title: '1 More Spot',
  wongedHands: [
    { enterAt: 2, exitBelow: 1, isActive: false },
  ]
};

export const wong2MoreQuick: WongStrategy = {
  title: '2 More Quick',
  wongedHands: [
    { enterAt: 2, exitBelow: 2, isActive: false },
    { enterAt: 3, exitBelow: 3, isActive: false },
  ]
};

export const neverWong: WongStrategy = {
  title: 'Never Wong',
  wongedHands: [],
};

export const wongingTitles: string[] = [
  '1 More Spot', 
  '2 More Spots', 
  '3 More Spots',
  '2 More Quick',
  'Never Wong'
];

export const defaultWongings: { [k: string]: WongStrategy } = {
  '1 More Spot': wong1MoreSpot, 
  '2 More Spots': wong2MoreSpots, 
  '3 More Spots': wong3MoreSpots, 
  '2 More Quick': wong2MoreQuick,
  'Never Wong': neverWong,
};