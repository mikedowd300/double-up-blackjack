import { InputTypeEnum, ConditionsEnum } from './enumerations';
import { CustomizationLink, RuleDescriptionMap } from './models';

export const cardValues: string[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];

export const ruleDescriptionMap: RuleDescriptionMap = {
  SI7: { 
    description: "Dealer stays on soft 17",
    why: "",
    inputType: InputTypeEnum.CHECKBOX,
    ruleName: ConditionsEnum.SI7,
  },
  RSA: { 
    description: "Re-split aces",
    why: "",
    inputType: InputTypeEnum.CHECKBOX,
    ruleName: ConditionsEnum.RSA,
  },
  MHFS: { 
    description: "Maximum hands from a split",
    why: "",
    inputType: InputTypeEnum.NUMBER,
    min: 1,
    max: 7, 
    ruleName: ConditionsEnum.MHFS,
  },
  DSA: { 
    description: "Player may draw on split aces",
    why: "",
    inputType: InputTypeEnum.CHECKBOX,
    ruleName: ConditionsEnum.DSA,
  },
  DFL: { 
    description: "Player may double for less",
    why: "",
    inputType: InputTypeEnum.CHECKBOX,
    ruleName: ConditionsEnum.DFL,
  },
  DAS: { 
    description: "Player may double after splits",
    why: "",
    inputType: InputTypeEnum.CHECKBOX,
    ruleName: ConditionsEnum.DAS,
  },
  MSE: { 
    description: "Mid-shoe entry is allowed",
    why: "",
    inputType: InputTypeEnum.CHECKBOX,
    ruleName: ConditionsEnum.MSE,
  },
  reshuffleOnDealerChange: { 
    description: "New dealer shuffles before dealing",
    why: "",
    inputType: InputTypeEnum.CHECKBOX,
    ruleName: ConditionsEnum.reshuffleOnDealerChange,
  },
  burnCardOnDealerChange: { 
    description: "New dealer burns a card before dealing",
    why: "",
    inputType: InputTypeEnum.CHECKBOX,
    ruleName: ConditionsEnum.burnCardOnDealerChange,
  },
  payRatio: { 
    description: "The Black Jack pay ratio",
    why: "",
    inputType: InputTypeEnum.RADIO,
    radioValues: null,
    ruleName: ConditionsEnum.payRatio,
  },
  lateSurrender: { 
    description: "Late surrender",
    why: "",
    inputType: InputTypeEnum.CHECKBOX,
    ruleName: ConditionsEnum.lateSurrender,
  },
  spotsPerTable: { 
    description: "Spots per table",
    why: "",
    min: 1,
    max: 10, 
    inputType: InputTypeEnum.NUMBER,
    ruleName: ConditionsEnum.spotsPerTable,
  },
  decksPerShoe: { 
    description: "Decks per shoe",
    why: "",
    inputType: InputTypeEnum.RANGE,
    min: 1,
    max: 10, 
    ruleName: ConditionsEnum.decksPerShoe,
  },
  cardsBurned: { 
    description: "Number of cards burned after shuffle",
    why: "",
    inputType: InputTypeEnum.RANGE,
    min: 0,
    max: 10, 
    ruleName: ConditionsEnum.cardsBurned,
  },
  minBet: { 
    description: "Table minimum bet",
    why: "",
    inputType: InputTypeEnum.NUMBER,
    min: 1, 
    ruleName: ConditionsEnum.minBet,
  },
  maxBet: { 
    description: "Table maximum bet",
    why: "",
    inputType: InputTypeEnum.NUMBER,
    min: 1,
    ruleName: ConditionsEnum.maxBet,
  },
  shufflePoint: { 
    description: "Shuffle point as a % of total cards",
    why: "",
    inputType: InputTypeEnum.RANGE,
    min: 1,
    max: 99, 
    ruleName: ConditionsEnum.shufflePoint,
  },
  countBurnCard: { 
    description: "Player sees a burn card",
    why: "",
    inputType: InputTypeEnum.CHECKBOX,
    ruleName: ConditionsEnum.countBurnCard,
  },
  handsPerDealer: { 
    description: "Number of hands per dealer",
    why: "",
    inputType: InputTypeEnum.NUMBER,
    min: 1, 
    ruleName: ConditionsEnum.handsPerDealer,
  },
  canDoubleOn: { 
    description: "Player may double on:",
    why: "",
    inputType: InputTypeEnum.RADIO,
    radioValues: null,
    ruleName: ConditionsEnum.canDoubleOn,
  },
  doubleUpLosesOnPush: {
    description: "The double-up portion of a bet loses on a normal push",
    why: "",
    inputType: InputTypeEnum.CHECKBOX,
    ruleName: ConditionsEnum.doubleUpLosesOnPush,
  },
  doubleUpLosesOnHalt: {
    description: "The double-up portion of a bet loses on ties on 16",
    why: "",
    inputType: InputTypeEnum.CHECKBOX,
    ruleName: ConditionsEnum.doubleUpLosesOnHalt,
  }
}

export const customizationLinks: CustomizationLink[] = [
  {
    title: "Conditions",
    description: "Customize and save a set of table conditions to mimic any casino",
    linkUrl: "/conditions",
  },{
    title: "Player",
    description: "Customize and save a new player to behave anyway you want",
    linkUrl: "/player",
  },{
    title: "Table",
    description: "Customize and save a table with the conditions and players of your choice",
    linkUrl: "/table",
  },{
    title: "Bet Spread",
    description: "Customize and save an approach to spreading a players bet so the players you create can adopt this strategy.",
    linkUrl: "/bet-spread",
  },{
    title: "Play Chart",
    description: "In addition to the built in play charts, you may customize and save new ones to define your player's behavior.",
    linkUrl: "/play-chart",
  },{
    title: "Unit Resizing",
    description: "Customize and save a plan for resizing your bets according to your changing bankroll. Assign this strategy to a player and watch the results.",
    linkUrl: "/unit-resizing",
  },{
    title: "Wonging",
    description: "Customize and save different approaches to wonging in additional hands based on the count. Compare results with players using different Wonging strategies.",
    linkUrl: "/wonging",
  },{
    title: "Tipping Approach",
    description: "Understand the cost of tipping by customizing different tipping approaches and watching the players bankroll results.",
    linkUrl: "/tipping",
  },{
    title: "Counting System",
    description: "Are you using the best counting strategy. In addition to the traditional systems, create and save your own counting systems. You can even use the 'Deviations' section to find index plays.",
    linkUrl: "/counting",
  },{
    title: "Insurance Plan",
    description: "When insurance is offered, have a plan of accepting it or not.",
    linkUrl: "/insurance",
  }
];

export const playerFirst2: string [] = [
  'AA', 'TT', '99', '88', '77', '66', '55', '44', '33', '22', 'AT', 'A9', 'A8', 'A7', 'A6', 'A5', 'A4', 'A3', 'A2', '20', '19', '18', '17', '16', '15', '14', '13', '12', '11', '10', '9', '8', '7', '6', '5'
];