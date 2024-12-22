import { TippingPlan } from "../models-constants-enums/models";

export const cheapTipper: TippingPlan = {
  title: "Cheap Tipper",
  tipToBetsizeRatios: [ [1, 50], [2, 500] ],
  maxTip: 2,
  afterBlackjack: true,
  dealerJoins: true,
  dealerLeaves: true,
  tipFirstHandOfShoe: false,
  playerIncreasesBet: false,
  everyXHands: null,
  tipSplitHandToo: false,
  doubleDownTip: false,
  doubleUpTip: false,
  tipWongHands: false,
  insureTip: false,
};

export const generousTipper: TippingPlan = {
  title: "Generous Tipper",
  tipToBetsizeRatios: [ [1, 25], [2, 50], [3, 100], [5, 250], [10, 500], [25, 1000] ],
  maxTip: 50,
  afterBlackjack: true,
  dealerJoins: true,
  dealerLeaves: true,
  tipFirstHandOfShoe: true,
  playerIncreasesBet: true,
  everyXHands: 10, 
  tipSplitHandToo: true,
  doubleDownTip: true,
  doubleUpTip: true,
  tipWongHands: true,
  insureTip: true,
};

export const neverTips: TippingPlan = {
  title: "Never Tips",
  tipToBetsizeRatios: [],
  maxTip: 0,
  afterBlackjack: false,
  dealerJoins: false,
  dealerLeaves: false,
  tipFirstHandOfShoe: false,
  playerIncreasesBet: false,
  everyXHands: null, 
  tipSplitHandToo: false,
  doubleDownTip: false,
  doubleUpTip: false,
  tipWongHands: false,
  insureTip: false,
};

export const tippingTitles: string[] = [
  "Cheap Tipper", 
  "Generous Tipper", 
  "Never Tips"
];

export const defaultTippingPlans: { [k: string]: TippingPlan } = {
  "Cheap Tipper": cheapTipper, 
  "Generous Tipper": generousTipper, 
  "Never Tips": neverTips,
}