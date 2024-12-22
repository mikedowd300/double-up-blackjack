export enum InputTypeEnum {
  TEXT = "TEXT",
  NUMBER = "number",
  RADIO = "radio",
  RANGE = "range",
  CHECKBOX = "checkbox",
}

export enum ConditionsEnum {
  title = 'title',
  SI7 = 'SI7',
  RSA = 'RSA',
  MHFS = 'MHFS',
  DSA = 'DSA',
  DFL = 'DFL',
  DAS = 'DAS',
  MSE = 'MSE',
  reshuffleOnDealerChange = 'reshuffleOnDealerChange',
  burnCardOnDealerChange = 'burnCardOnDealerChange',
  payRatio = 'payRatio',
  spotsPerTable = 'spotsPerTable',
  decksPerShoe = 'decksPerShoe',
  cardsBurned = 'cardsBurned',
  minBet = 'minBet',
  maxBet = 'maxBet',
  shufflePoint = 'shufflePoint',
  countBurnCard = 'countBurnCard',
  handsPerDealer = 'handsPerDealer',
  canDoubleOn = 'canDoubleOn',
  doubleUpLosesOnPush = 'doubleUpLosesOnPush',
  doubleUpLosesOnHalt = "doubleUpLosesOnHalt",
  lateSurrender = 'lateSurrender',
}

export enum DoubleDownOnEnum {
  DA2 = 'any 2 cards',
  DT11 = 'hard 10 and 11 only',
  D911 = 'hard 9 through 11 only',
  D811 = 'hard 8 through 11 only',
}

export enum PayRatioEnum {
  THREE_to_ONE = '3/1',
  THREE_to_TWO = '3/2',
  SIX_to_FIVE = '6/5',
  TWO_to_ONE = '2/1',
  ONE_to_ONE = '1/1',
};

export enum LocalStorageItemsEnum {
  SHOES = 'shoes',
  CONDITIONS = 'conditions',
  TIPPING = 'tipping',
  BET_SPREAD = 'betSpread',
  WONG = 'wong',
  UNIT_RESIZE = 'unitResize',
  PLAY = 'play',
  PLAYER_CONFIG = "playerConfig",
  TABLE_CONFIG = 'tableConfig',
  COUNT = 'count',
  DEVIATION_CHART = 'deviationChart',
  INSURANCE = 'insurance',
}

export enum ChipTypeEnum {
  WHITE = "white",
  RED = "red",
}

export enum RoundingMethodEnum {
  UP = "round up",
  DOWN = "round down",
  OFF = "round off",
}

export enum TrueCountTypeEnum {
  HALF_FLOOR = 'halfFloor',
  HALF_ROUNDED = 'halfRounded',
  FULL_FLOOR = 'fullFloor',
  FULL_ROUNDED = 'fullRounded',
}

export enum CardNameEnum {
  C_A = 'A',
  C_2 = '2',
  C_3 = '3',
  C_4 = '4',
  C_5 = '5',
  C_6 = '6',
  C_7 = '7',
  C_8 = '8',
  C_9 = '9',
  C_T = 'T',
  C_J = 'J',
  C_Q = 'Q',
  C_K = 'K',
}

export enum HandOptionEnums {
  HIT = 'hit',
  STAY = 'stay',
  SPLIT = 'split',
  DOUBLE = 'double',
  DOUBLE_UP = 'doubleup',
  SURRENDER = 'surrender',
}

export enum SpotStatusEnum {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  TAKEN = 'taken',
}

export enum HandActionEnum {
  HIT = 'hit',
  SPLIT = 'split',
  DOUBLE = 'double',
  DOUBLE_UP = 'doubleup',
  INSURE = 'insure',
  SURRENDER = 'surrender',
}

export enum HandOutcomeEnum {
  WON_WITH_BETTER_HAND = "Won with better hand",
  WON_BY_DEALER_BUST = "Won because dealer busted",
  PUSHED = "Pushed",
  BUSTED = "Busted",
  HALTED = "Halted",
  BLACKJACK = "Blackjack",
  LOST_TO_BETTER_HAND = "Lost to better hand",
  LOST_TO_BLACKJACK = "Lost to Dealer's Blackjack",
  SURRENDERED = "Surrendered",
}