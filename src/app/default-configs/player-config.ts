import { PlayerConfig } from "../models-constants-enums/models";

export const ploppy1: PlayerConfig = {
  title: "Ploppy 1",
  description: "Just taking up space",
  initialBettingUnit: 25,
  initialBankroll: 100000000,
  playStrategyTitle: 'Basic H17',
  betSpreadStrategyTitle: 'Basic 1 to 6',
  unitResizingStrategyTitle: 'Never Resize',
  tippngStrategyTitle: 'Cheap Tipper',
  wongingStrategyTitle: 'Never Wong',
  countStrategyTitle: 'Hi Lo',
  insurancePlanTitle: 'Never Insure',
};

export const ploppy2: PlayerConfig = {
  title: "Ploppy 2",
  description: "Just eating cards",
  initialBettingUnit: 25,
  initialBankroll: 100000000,
  playStrategyTitle: 'Basic H17',
  betSpreadStrategyTitle: 'No Spread',
  unitResizingStrategyTitle: 'Resize Reduce Risk',
  tippngStrategyTitle: 'Never Tips',
  wongingStrategyTitle: 'Never Wong',
  countStrategyTitle: 'Optimized Insurance',
  insurancePlanTitle: 'Never Insure',
};

export const hiLoJo: PlayerConfig = {
  title: "Hi Lo Jo",
  description: "Counts With HiLo",
  initialBettingUnit: 25,
  initialBankroll: 50000,
  playStrategyTitle: 'Heavy 6 H17 Basic',
  betSpreadStrategyTitle: 'Quick 1 to 8',
  unitResizingStrategyTitle: 'Resize Reduce Risk',
  tippngStrategyTitle: 'Never Tips',
  wongingStrategyTitle: '1 More Spot',
  countStrategyTitle: 'Hi Lo',
  insurancePlanTitle: 'Never Insure',
};

export const heavy6BasicBob: PlayerConfig = {
  title: "Heavy 6 Basic Bob",
  description: "Counts With Heavy 6 H17",
  initialBettingUnit: 25,
  initialBankroll: 50000,
  playStrategyTitle: 'Heavy 6 H17 Basic',
  betSpreadStrategyTitle: 'Quick 1 to 8',
  unitResizingStrategyTitle: 'Resize Reduce Risk',
  tippngStrategyTitle: 'Never Tips',
  wongingStrategyTitle: '1 More Spot',
  countStrategyTitle: 'Heavy 6',
  insurancePlanTitle: 'Never Insure',
};

export const heavy6DevyDan: PlayerConfig = {
  title: "Heavy 6 Deviation Dan",
  description: "Counts With Heavy 6 H17 with Deviations",
  initialBettingUnit: 25,
  initialBankroll: 50000,
  playStrategyTitle: 'Heavy 6 H17 Deviations',
  betSpreadStrategyTitle: 'Quick 1 to 8',
  unitResizingStrategyTitle: 'Resize Reduce Risk',
  tippngStrategyTitle: 'Never Tips',
  wongingStrategyTitle: '1 More Spot',
  countStrategyTitle: 'Heavy 6',
  insurancePlanTitle: 'Never Insure',
};

export const blitzBarb: PlayerConfig = {
  title: "Blitz Barb",
  description: "Hits Hard And Fast",
  initialBettingUnit: 25,
  initialBankroll: 50000,
  playStrategyTitle: 'Heavy 6 H17 Deviations',
  betSpreadStrategyTitle: 'Quick 1 to 10',
  unitResizingStrategyTitle: 'Resize Reduce Risk',
  tippngStrategyTitle: 'Never Tips',
  wongingStrategyTitle: '2 More Quick',
  countStrategyTitle: 'Heavy 6',
  insurancePlanTitle: 'Insure Above True 3',
};

export const playerTitles: string[] = [
  "Ploppy 1",
  "Ploppy 2",
  "Hi Lo Jo",
  "Heavy 6 Basic Bob",
  "Heavy 6 Deviation Dan",
  "Blitz Barb",
];

export const defaultPlayers: { [k: string]: PlayerConfig } = {
  "Ploppy 1": ploppy1,
  "Ploppy 2": ploppy2,
  "Hi Lo Jo": hiLoJo,
  "Heavy 6 Basic Bob": heavy6BasicBob,
  "Heavy 6 Deviation Dan": heavy6DevyDan,
  "Blitz Barb": blitzBarb,
};