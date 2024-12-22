import {
  CardNameEnum,
  ChipTypeEnum,
  ConditionsEnum,
  DoubleDownOnEnum,
  HandActionEnum,
  HandOutcomeEnum,
  InputTypeEnum,
  PayRatioEnum,
  RoundingMethodEnum,
  SpotStatusEnum,
  TrueCountTypeEnum,
} from './enumerations';

export interface CountingMethodValueMap {
  [CardNameEnum.C_A]: number;
  [CardNameEnum.C_2]: number;
  [CardNameEnum.C_3]: number;
  [CardNameEnum.C_4]: number;
  [CardNameEnum.C_5]: number;
  [CardNameEnum.C_6]: number;
  [CardNameEnum.C_7]: number;
  [CardNameEnum.C_8]: number;
  [CardNameEnum.C_9]: number;
  [CardNameEnum.C_T]: number;
  [CardNameEnum.C_J]: number;
  [CardNameEnum.C_Q]: number;
  [CardNameEnum.C_K]: number;
};

export interface CountingMethod {
  title: string,
  valuesMap: CountingMethodValueMap,
  startingCount: number;
  isBalanced: boolean;
  convertsToTC: boolean;
  roundingMethod: RoundingMethodEnum;
  useHalfCount: boolean;
}

export interface CountingMethodMap {
  [k: string]: CountingMethod,
}

export interface CustomizationLink {
  title: string;
  description: string;
  linkUrl: string;
}

export interface PlayStrategyCombo {
  [k: string]: {
    conditions: string,
    options: string;
  }
}

export interface RuleInput {
  description: string;
  why?: string;
  inputType: InputTypeEnum;
  min?: number;
  max?: number; 
  ruleName: ConditionsEnum;
  radioValues?: any;
  displayInColumn?: boolean;
}

export interface RuleDescriptionMap {
  [k: string]: RuleInput 
}

export interface PlayActionOptions {
  options: string;
  conditions: string;
}

export interface Wong {
  enterAt: number,
  exitBelow: number;
  isActive: boolean;
}

export interface WongStrategy {
  title: string;
  wongedHands: Wong[];
}

export interface InsurancePlan {
  title: string;
  alwaysInsure: boolean;
  neverInsure: boolean;
  atTCof: number;
}

export interface Conditions {
  title?: string;
  S17: boolean;
  RSA: boolean;
  MHFS: number;
  DSA: boolean;
  DFL: boolean;
  DAS: boolean;
  MSE: boolean;
  reshuffleOnDealerChange: boolean;
  burnCardOnDealerChange: boolean;
  payRatio: PayRatioEnum;
  spotsPerTable: number;
  decksPerShoe: number;
  cardsBurned: number;
  minBet: number;
  maxBet: number;
  shufflePoint: number;
  countBurnCard: boolean;
  handsPerDealer: number;
  canDoubleOn:  DoubleDownOnEnum;
  doubleUpLosesOnPush: boolean;
  doubleUpLosesOnHalt: boolean;
  lateSurrender: boolean;
}

export interface ShoeConditions {
  decksPerShoe: number;
  cardsBurned: number;
  shufflePoint: number;
  countBurnCard: boolean;
}

export interface BetSpreadStrategy {
  title: string;
  spreads: { [k: string]: number };
  roundBetToNearest: ChipTypeEnum,
  roundingMethod: RoundingMethodEnum,
  useHalfCount: boolean;
}

export interface PlayerConfig {
  title: string;
  description: string;
  initialBettingUnit: number;
  initialBankroll: number;
  playStrategyTitle: string;
  betSpreadStrategyTitle: string;
  unitResizingStrategyTitle: string;
  tippngStrategyTitle: string;
  wongingStrategyTitle: string;
  countStrategyTitle: string;
  insurancePlanTitle: string;
}

export interface TippingPlan {
  title: string;
  tipToBetsizeRatios: number[][];
  maxTip: number;
  afterBlackjack: boolean;
  dealerJoins: boolean;
  dealerLeaves: boolean;
  tipFirstHandOfShoe: boolean;
  playerIncreasesBet: boolean;
  everyXHands: number;
  tipWongHands: boolean;
  tipSplitHandToo: boolean;
  doubleDownTip: boolean;
  doubleUpTip: boolean;
  insureTip: boolean;
};

export interface UnitResizeStrategy {
  title: string;
  unitProgression: number[];
  increaseAtMultiple: number[];
  decreaseAtMultiple: number[];
  roundToNearest: ChipTypeEnum;
  roundingMethod: RoundingMethodEnum;
}

export interface PlayStrategy {
  title: string;
  combos: { [k: string]: PlayActionOptions };
}

export type AnyStrategy = 
  | WongStrategy 
  | Conditions 
  | UnitResizeStrategy 
  | TippingPlan
  | BetSpreadStrategy
  | PlayStrategy
  | PlayerConfig
  | TableConfig
  | CountingMethod
  | InsurancePlan

export interface SpotUIproperty {
  description: string;
  value: string | number;
}

export interface SpotUIObj {
  title: SpotUIproperty;
  bankroll: SpotUIproperty;
  bettingUnit: SpotUIproperty;
  playStategy: SpotUIproperty;
  spreadStrategy: SpotUIproperty;
  tippingStrategy: SpotUIproperty;
  resizeStrategy: SpotUIproperty;
  wongingStrategy: SpotUIproperty;
  countingStratgey: SpotUIproperty;
}

export interface SimInfo {
  tableSkeleton: TableConfig | null;
  iterations: number | null;
}

export interface TableConfig {
  title: string;
  players: PlayerTableInfo[];
  conditionsTitle: string;
}

export interface PlayerTableInfo {
  seatNumber: number;
  playerConfigTitle: string;
}

export interface TableSpotsInformation {
  spotsPertable: number;
  playerSpotMap: any;
}

export interface TableSpot {
  status: SpotStatusEnum;
  controlledBy: string;
  id: number;
}

export interface CardInfo {
  image: string;
  name: string;
}

export interface HandHistory {
  betSize?: number;
  cards?: CardInfo[];
  value?: number;
  actions?: HandActionEnum[];
  outcome?: HandOutcomeEnum;
  winnings?: number;
  isFromSplit?: boolean;
  didSurrender?: boolean;
  isFromWong?: boolean;
  tipSize?: number;
}

export interface PlayerRoundHistory {
  spotIds: number[];
  hands: HandHistory[];
  bankroll: number;
  beginningTrueCount: number;
}

export interface WinningsChartDatum {
  totalBet: number, 
  totalWon: number,
  instances: number,
}

export interface WinningsChartDataByPlayer {
  [k: string]: WinningsChartDatum
}

export interface WinningsChartData {
  [k: string]: WinningsChartDataByPlayer 
}

export interface InsuranceInstance {
  instances: number;
  hasItCount: number
}

export interface InsuranceRecordByCount {
  [k: string]: InsuranceInstance;
}

export interface InsuranceDataByPlayer {
  [k: string]: InsuranceRecordByCount;
}