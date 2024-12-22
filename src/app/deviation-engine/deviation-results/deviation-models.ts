import { DoubleDownOnEnum, RoundingMethodEnum } from "../../models-constants-enums/enumerations";

export interface DeviationPlayerTableInfo {
  seatNumber: number;
  playerConfigTitle: string;
  playStrategyTitle: string;
  countingMethodTitle: string
}

export enum PlayActionsEnum {
  STAY = 'stay',
  SPLIT = 'split',
  HIT = 'hit',
  DOUBLE = 'double',
  DOUBLE_UP = 'doubleup'
}

export interface DeviationResult {
  instances: number;
  amountBet: number;
  amountWon: number
}

export interface DeviationResultByAction {
  [PlayActionsEnum.STAY]?: DeviationResult;
  [PlayActionsEnum.SPLIT]?: DeviationResult;
  [PlayActionsEnum.HIT]?: DeviationResult;
  [PlayActionsEnum.DOUBLE]?: DeviationResult;
  [PlayActionsEnum.DOUBLE_UP]?: DeviationResult;
}

export interface DeviationResultsObj {
  [k: string]: DeviationResultByAction
}

export interface CondensedDeviationTableCondition {
  S17: boolean;
  RSA: boolean;
  DSA: boolean;
  DAS: boolean;
  canDoubleOn:  DoubleDownOnEnum;
  doubleUpLosesOnPush: boolean;
  doubleUpLosesOnHalt: boolean;
  lateSurrender: boolean;
}

export enum HandStageEnum {
  FIRST_2_CARDS = 'First 2 Cards',
  AFTER_HITTING = 'After a Hit',
}

export interface DeviationInfo {
  variableConditions: CondensedDeviationTableCondition;
  playerCards: string;
  actions: string[];
  instances: number | null;
  handStage: HandStageEnum;
  roundingMethod: RoundingMethodEnum;
  countingMethodTitle: string;
  playStrategyTitle: string;
}

export const LegalActionsMap = {
  [HandStageEnum.FIRST_2_CARDS]: ['Hit', 'Stay', 'Double', 'DoubleUp', 'Split', 'Surrender'],
  [HandStageEnum.AFTER_HITTING]: ['Hit', 'Stay'],
};

export const playerFirst2: string [] = [
  'AA', 'TT', '99', '88', '77', '66', '55', '44', '33', '22', 'AT', 'A9', 'A8', 'A7', 'A6', 'A5', 'A4', 'A3', 'A2', '20', '19', '18', '17', '16', '15', '14', '13', '12', '11', '10', '9', '8', '7', '6', '5'
];

export const playerFirst2No20: string [] = [
  'AA', 'TT', '99', '88', '77', '66', '55', '44', '33', '22', 'AT', 'A9', 'A8', 'A7', 'A6', 'A5', 'A4', 'A3', 'A2', '19', '18', '17', '16', '15', '14', '13', '12', '11', '10', '9', '8', '7', '6', '5'
];

export const dealerUpCards: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'A'];

export interface DeviationCondition {
  description: string;
  value: boolean | DoubleDownOnEnum;
}

export interface DeviationTableConditions {
  S17: DeviationCondition,
  RSA: DeviationCondition,
  DSA: DeviationCondition,
  DAS: DeviationCondition,
  canDoubleOn: DeviationCondition,
  doubleUpLosesOnPush: DeviationCondition,
  doubleUpLosesOnHalt: DeviationCondition,
  lateSurrender: DeviationCondition,
}

export const InitialDeviationTableConditions: DeviationTableConditions = {
  S17: {
    description: 'Stay on Soft 17',
    value: false,
  },
  RSA: {
    description: 'Resplit Aces',
    value: true,
  },
  DSA: {
    description: 'Draw On Split Aces',
    value: false,
  },
  DAS: {
    description: 'Double After Split',
    value: true,
  },
  canDoubleOn: {
    description: 'Can Double On Rule',
    value: DoubleDownOnEnum.DA2,
  },
  doubleUpLosesOnPush: {
    description: 'Double Up Loses On Push',
    value: true,
  },
  doubleUpLosesOnHalt: {
    description: 'Double Up Loses On Halt',
    value: false,
  },
  lateSurrender: {
    description: 'Late Surrender',
    value: false,
  },
};