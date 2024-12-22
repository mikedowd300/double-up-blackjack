import { BetSpreadStrategy } from '../models-constants-enums/models';
import { ChipTypeEnum, RoundingMethodEnum } from '../models-constants-enums/enumerations';

export const basic1to6: BetSpreadStrategy = {
  title: "Basic 1 to 6",
  spreads: {
    "-1": 1,
    "0": 1,
    "1": 2,
    "2": 3,
    "3": 4,
    "4": 5,
    "5": 6,
  },
  roundBetToNearest: ChipTypeEnum.WHITE,
  roundingMethod: RoundingMethodEnum.OFF,
  useHalfCount: false
}; 

export const quick1to8: BetSpreadStrategy = {
  title: "Quick 1 to 8",
  spreads: {
    "-1": 1,
    "0": 1,
    "1": 2,
    "2": 4,
    "3": 6,
    "4": 8,
  },
  roundBetToNearest: ChipTypeEnum.WHITE,
  roundingMethod: RoundingMethodEnum.OFF,
  useHalfCount: false
};

export const quick1to10: BetSpreadStrategy = {
  title: "Quick 1 to 10",
  spreads: {
    "-1": 1,
    "0": 1,
    "1": 2,
    "2": 4,
    "3": 6,
    "4": 8,
    "5": 10,
  },
  roundBetToNearest: ChipTypeEnum.WHITE,
  roundingMethod: RoundingMethodEnum.OFF,
  useHalfCount: false
};

export const noSpread: BetSpreadStrategy = {
  title: "No Spread",
  spreads: { "0": 1 },
  roundBetToNearest: ChipTypeEnum.WHITE,
  roundingMethod: RoundingMethodEnum.DOWN,
  useHalfCount: false
};

export const betSpreadTitles: string[] = [
  "Basic 1 to 6", 
  "No Spread",
  "Quick 1 to 8",
  "Quick 1 to 10",
];

export const defaultBetSpreads: { [k: string]: BetSpreadStrategy } = {
  "Basic 1 to 6": basic1to6,
  "No Spread": noSpread,
  "Quick 1 to 8": quick1to8,
  "Quick 1 to 10": quick1to10,
};