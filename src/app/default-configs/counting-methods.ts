import { CountingMethod } from "../models-constants-enums/models";
import { CardNameEnum, RoundingMethodEnum } from '../models-constants-enums/enumerations'

export const hiLo: CountingMethod = {
  title: 'Hi Lo', 
  valuesMap: {
    [CardNameEnum.C_A]: -1,
    [CardNameEnum.C_2]: 1,
    [CardNameEnum.C_3]: 1,
    [CardNameEnum.C_4]: 1,
    [CardNameEnum.C_5]: 1,
    [CardNameEnum.C_6]: 1,
    [CardNameEnum.C_7]: 0,
    [CardNameEnum.C_8]: 0,
    [CardNameEnum.C_9]: 0,
    [CardNameEnum.C_T]: -1,
    [CardNameEnum.C_J]: -1,
    [CardNameEnum.C_Q]: -1,
    [CardNameEnum.C_K]: -1,
  },
  startingCount: 0,
  convertsToTC: true,
  isBalanced: true,
  roundingMethod: RoundingMethodEnum.DOWN,
  useHalfCount: false,
};

export const Ace5: CountingMethod = {
  title: 'Ace 5', 
  valuesMap: {
    [CardNameEnum.C_A]: -1,
    [CardNameEnum.C_2]: 0,
    [CardNameEnum.C_3]: 0,
    [CardNameEnum.C_4]: 0,
    [CardNameEnum.C_5]: 1,
    [CardNameEnum.C_6]: 0,
    [CardNameEnum.C_7]: 0,
    [CardNameEnum.C_8]: 0,
    [CardNameEnum.C_9]: 0,
    [CardNameEnum.C_T]: 0,
    [CardNameEnum.C_J]: 0,
    [CardNameEnum.C_Q]: 0,
    [CardNameEnum.C_K]: 0,
  },
  startingCount: 0,
  convertsToTC: true,
  isBalanced: true,
  roundingMethod: RoundingMethodEnum.DOWN,
  useHalfCount: false,
};

export const NoCount: CountingMethod = {
  title: 'No Count', 
  valuesMap: {
    [CardNameEnum.C_A]: 0,
    [CardNameEnum.C_2]: 0,
    [CardNameEnum.C_3]: 0,
    [CardNameEnum.C_4]: 0,
    [CardNameEnum.C_5]: 0,
    [CardNameEnum.C_6]: 0,
    [CardNameEnum.C_7]: 0,
    [CardNameEnum.C_8]: 0,
    [CardNameEnum.C_9]: 0,
    [CardNameEnum.C_T]: 0,
    [CardNameEnum.C_J]: 0,
    [CardNameEnum.C_Q]: 0,
    [CardNameEnum.C_K]: 0,
  },
  startingCount: 0,
  convertsToTC: true,
  isBalanced: true,
  roundingMethod: RoundingMethodEnum.DOWN,
  useHalfCount: false,
};

export const heavy6: CountingMethod = {
  title: 'Heavy 6', 
  valuesMap: {
    [CardNameEnum.C_A]: -1,
    [CardNameEnum.C_2]: 1,
    [CardNameEnum.C_3]: 1,
    [CardNameEnum.C_4]: 1,
    [CardNameEnum.C_5]: 1,
    [CardNameEnum.C_6]: 2,
    [CardNameEnum.C_7]: 0,
    [CardNameEnum.C_8]: 0,
    [CardNameEnum.C_9]: -1,
    [CardNameEnum.C_T]: -1,
    [CardNameEnum.C_J]: -1,
    [CardNameEnum.C_Q]: -1,
    [CardNameEnum.C_K]: -1,
  },
  startingCount: 0,
  convertsToTC: true,
  isBalanced: true,
  roundingMethod: RoundingMethodEnum.DOWN,
  useHalfCount: false,
};

export const lite6: CountingMethod = {
  title: 'Lite 6', 
  valuesMap: {
    [CardNameEnum.C_A]: -1,
    [CardNameEnum.C_2]: 0,
    [CardNameEnum.C_3]: 1,
    [CardNameEnum.C_4]: 1,
    [CardNameEnum.C_5]: 1,
    [CardNameEnum.C_6]: 2,
    [CardNameEnum.C_7]: 0,
    [CardNameEnum.C_8]: 0,
    [CardNameEnum.C_9]: 0,
    [CardNameEnum.C_T]: -1,
    [CardNameEnum.C_J]: -1,
    [CardNameEnum.C_Q]: -1,
    [CardNameEnum.C_K]: -1,
  },
  startingCount: 0,
  convertsToTC: true,
  isBalanced: true,
  roundingMethod: RoundingMethodEnum.DOWN,
  useHalfCount: false,
};

export const optimizedInsurance: CountingMethod = {
  title: 'Optimized Insurance', 
  valuesMap: {
    [CardNameEnum.C_A]: 0,
    [CardNameEnum.C_2]: 0,
    [CardNameEnum.C_3]: 1,
    [CardNameEnum.C_4]: 1,
    [CardNameEnum.C_5]: 1,
    [CardNameEnum.C_6]: 1,
    [CardNameEnum.C_7]: 0,
    [CardNameEnum.C_8]: 0,
    [CardNameEnum.C_9]: 0,
    [CardNameEnum.C_T]: -1,
    [CardNameEnum.C_J]: -1,
    [CardNameEnum.C_Q]: -1,
    [CardNameEnum.C_K]: -1,
  },
  startingCount: 0,
  convertsToTC: true,
  isBalanced: true,
  roundingMethod: RoundingMethodEnum.DOWN,
  useHalfCount: false,
};

export const countTitles: string[] = [
  'Hi Lo', 
  'Ace 5', 
  'No Count', 
  'Heavy 6', 
  'Lite 6',
  'Optimized Insurance'
];

export const defaultCounts: { [k: string]: CountingMethod } = {
  'Hi Lo': hiLo, 
  'Ace 5': Ace5, 
  'No Count': NoCount,
  'Heavy 6': heavy6,
  'Lite 6': lite6,
  'Optimized Insurance' :optimizedInsurance,
};
