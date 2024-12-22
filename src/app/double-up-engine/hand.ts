import { Card } from './card';
import { Conditions } from '../models-constants-enums/models';
import { 
  HandActionEnum,
  HandOptionEnums, 
  HandOutcomeEnum, 
  PayRatioEnum 
} from '../models-constants-enums/enumerations';
import { playerFirst2  } from '../models-constants-enums/constants';
import { Player } from './player';
import { HandRecord } from '../history/history-models';

export class Hand {
  cards: Card[] = [];
  hasBeenPaid: boolean = false;
  hasDoubled: boolean = false;
  payRatioMap = {
    [PayRatioEnum.THREE_to_ONE]: 3,
    [PayRatioEnum.THREE_to_TWO]: 1.5,
    [PayRatioEnum.SIX_to_FIVE]: 1.2,
    [PayRatioEnum.TWO_to_ONE]: 2,
    [PayRatioEnum.ONE_to_ONE]: 1,
  };
  hadDoubledXtimes: number = 0;
  options: string[] = [];
  decisionMap;
  decisionRecord: string[] = [];
  handResult: any = {
    outcome: [],
    winnings: [],
  }
  actionMap = {
    'ST': 'stay',
    'SP': 'split',
    'SR': 'surrender',
    'H': 'hit',
    'RC': 'rescue',
    'DD': 'double',
    'DU': 'doubleup',
  };
  cardMap = { 1: 'A', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: 'T' };
  dealerCardMap = { 1: 'A', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10' };
  playStrategy;
  conditions: Conditions;
  doubleUpAmount: number = 0;
  player: Player;
  insuranceAmount: number = 0;
  record: HandRecord;

  constructor(
    private spotId: number,
    private shared, 
    public betAmount: number,
    private handId: number,
    private isFromSplit: boolean = false,
  ) {
    this.conditions = this.shared.getConditions();
    this.playStrategy = this.shared.getPlayerBySpotId(this.spotId).playingStrategy.combos;
    this.record = this.getRecord();
    this.decisionMap = {
      'stay': () => this.stand(),
      'split': () => this.split(),
      'surrender': () => this.surrender(),
      'hit': () => this.hit(),
      'double': () => this.double(),
      'doubleup': () => this.doubleup()
    };
    this.player = this.shared.getPlayerBySpotId(this.spotId);
  }

  private getRecord(record = null): HandRecord {
    const partialRecord = {
      actions: [],
      outcome: null,
      winnings: 0,
      isFromSplit: this.isFromSplit,
      tipSize: 0,
    }
    const partialComputedRecord = {
      betAmount: this.betAmount,
      cards: this.cards.map(c => ({ image: c.image, name: c.name })),
      value: this.getValue(),
    };
    return !!record 
      ? { ... record, ... partialComputedRecord }
      : { ...partialRecord, ...partialComputedRecord };
  }

  placeInsuranceBet(amount: number = (this.betAmount / 2)): void  {
    this.player.updateInsuranceHistory();
    if(this.player.insurancePlan.alwaysInsure) {
      this.insuranceAmount = amount;
    } else if(this.player.insurancePlan.neverInsure) {
      this.insuranceAmount = 0;
    } else if(this.player.insurancePlan.atTCof) {
      const tc = this.player.getTrueCountByTenth();
      this.insuranceAmount = tc >= this.player.insurancePlan.atTCof ? amount : 0;
    }
    if(this.insuranceAmount > 0) {
      this.record.actions.push(HandActionEnum.INSURE);
      this.player.incTotalInsuranceBet(this.insuranceAmount);
      this.player.totalBet += this.insuranceAmount;
    }
    this.player.insureTip(this.isFromWong());
  }

  payInsurance(): void  {
    const amount: number = this.shared.dealerHasBlackjack() 
      ? this.insuranceAmount * 2 
      : (-(this.insuranceAmount));
    this.player.payBankroll(amount);
    this.record.winnings += amount;
    this.player.incTotalInsurancePaid(amount);
  }

  playHand(): void  {
    if(this.isFromSplit && this.cards.length === 1) {
      this.cards.push(this.shared.deal());
    }
    if(!this.isBust()) { 
      this.getOptions();
      this.makeDecision();
    }
  }

  isFromWong(): boolean {
    return this.player.wongSpotIds.includes(this.spotId);
  }

  makeDecision(): void  {
    const chartKey = this.createChartKey();
    let options: string[] = this.playStrategy[chartKey].options
      .split(' ')
      .map(op => this.actionMap[op.trim()]);
    let conditions: string[] = this.playStrategy[chartKey].conditions
      .split(' ')
      .filter(c => c != '')
      .map(c => c.trim());
    while(conditions.length < options.length) {
      conditions.push('?');
    }
    let actionConditions: any[] = options
      .map((op, i) => ({ [op]: (conditions[i] ? this.evaluateCondition(conditions[i]) : true) }))
      .filter((x, i) => this.options.includes(options[i]));
    let i = 0;
    let action: string = Object.keys(actionConditions[0])[0];
    while(!actionConditions[i][Object.keys(actionConditions[i])[0]]) {
      i++;
      action = Object.keys(actionConditions[i])[0];
    }
    this.decisionMap[action]();
  }

  evaluateCondition(condition: string): boolean {
    const valCard1 = this.cards[0].cardValue;
    const valCard2 = this.cards[1].cardValue;
    const countThreshold = parseInt(condition);
    const trueCountType = this.shared.getPlayerBySpotId(this.spotId).trueCountType;
    const countingMethod = this.shared.getPlayerBySpotId(this.spotId).countingMethod;
    const trueCount = this.shared.getTrueCount(countingMethod, trueCountType);
    if(parseInt(condition) < 0) {
      return(trueCount <= countThreshold)
    }
    if(parseInt(condition) > 0) {
      return(trueCount >= countThreshold)
    }
    return true
  }

  createChartKey(): string {
    if(this.cards.length === 2) {
      let first: number;
      let second: number;
      if(this.cards[0].cardValue === 1) {
        first = this.cards[0].cardValue;
        second = this.cards[1].cardValue
      } else if(this.cards[1].cardValue === 1) {
        first = this.cards[1].cardValue;
        second = this.cards[0].cardValue
      } else {
        first = this.cards[0].cardValue > this.cards[1].cardValue ? this.cards[0].cardValue : this.cards[1].cardValue;
        second = this.cards[0].cardValue < this.cards[1].cardValue ? this.cards[0].cardValue : this.cards[1].cardValue
      }
      const first2Cards = `${ this.cardMap[first] }${ this.cardMap[second] }`;
      return playerFirst2.includes(first2Cards)
        ? `${ this.dealerCardMap[this.shared.getDealerUpCard()] }-${ first2Cards }`
        : `${ this.dealerCardMap[this.shared.getDealerUpCard()] }-${ this.cards[0].cardValue + this.cards[1].cardValue }`;
    } 
    return this.getValue() === this.getSoftValue()
      ? `${ this.dealerCardMap[this.shared.getDealerUpCard()] }-${ this.getValue() }`
      : `${ this.dealerCardMap[this.shared.getDealerUpCard()] }-A${ this.getSoftValue() - 1 }`;
  }

  stand(): void  {}

  hit(): void  {
    this.record.actions.push(HandActionEnum.HIT);
    this.cards.push(this.shared.deal());
    if(this.isBust()) {
      this.payBust();
    } else if(!this.is21()) {
      this.playHand();
    } 
  }

  double(): void  {
    this.record.actions.push(HandActionEnum.DOUBLE);
    const bankroll = this.player.bankroll;
    this.player.doubleTip(this.isFromWong(), this.isFromSplit);
    this.player.incTotalBet(this.betAmount); // Careful not to inc the original bet amount too
    this.betAmount = bankroll < (2 * this.betAmount) ? bankroll : 2 * this.betAmount;
    this.cards.push(this.shared.deal());
    if(this.isBust()) {
      this.payBust();
    }
  }

  doubleup(): void  {
    this.record.actions.push(HandActionEnum.DOUBLE_UP);
    this.doubleUpAmount = this.player.bankroll < this.betAmount ? this.player.bankroll : this.betAmount;
    this.player.incTotalBet(this.doubleUpAmount);
    this.player.doubleUpTip(this.isFromWong(), this.isFromSplit);
    this.betAmount += this.doubleUpAmount;
    this.stand();
  }

  split(): void  {
    this.record.actions.push(HandActionEnum.SPLIT);
    const bankroll = this.player.bankroll;
    this.player.incTotalBet(this.player.betSize);
    this.shared.addHand(true, this.betAmount);
    this.shared.seedSplitHand(this.cards.pop());
    this.cards.push(this.shared.deal());
    this.isFromSplit = true;
    this.record.isFromSplit = true;
    this.player.tipSplitHands(this.isFromWong());
    this.playHand();
  }

  surrender(): void {
    this.record.outcome = HandOutcomeEnum.SURRENDERED;
    this.record.actions.push(HandActionEnum.SURRENDER);
    this.paySurrender();
    this.stand();
  }

  clearCards(): void {
    this.shared.discard(this.cards);
  }

  hasBlackjack(): boolean {
    return this.cards.length === 2 && this.getValue() === 21 && !this.isFromSplit;
  }

  hasAce(): boolean {
    return this.cards.filter(card => card.cardValue === 1).length > 0;
  }

  getValue(): number {
    let value = 0;
    this.cards.forEach(card => value += card.cardValue);
    if(this.hasAce()) {
      value = (value + 10) > 21 ? value : (value + 10);
    }
    return value;
  }

  getSoftValue(): number {
    let value = 0;
    this.cards.forEach(card => value += card.cardValue);
    return value;
  }

  is21(): boolean {
    return this.getValue() === 21;
  }
  
  isBust(): boolean {
    return this.getValue() > 21;
  }
  
  isBlackJack(): boolean {
    return this.cards.length === 2 && this.is21() && !this.isFromSplit;
  }

  isFromSplitAces(): boolean {
    return this.isFromSplit && this.cards[0].cardValue === 1
  }

  paySurrender(): void {
    this.player.payBankroll(this.betAmount / (-2))
    this.record.winnings -= (this.betAmount / (2));
    this.hasBeenPaid = true;
  }

  payDealersBlackjack(spotId: number): void {
    if(!this.hasBeenPaid && !this.hasBlackjack()) {
      this.record.outcome = HandOutcomeEnum.LOST_TO_BLACKJACK;
      this.player.payBankroll(-(this.betAmount))
      this.record.winnings -= this.betAmount;
      this.hasBeenPaid = true;
    } 
  }

  payBlackjack(spotId: number): void {
    const amount = this.betAmount * this.payRatioMap[this.conditions.payRatio];
    if(!this.hasBeenPaid && this.hasBlackjack() && !this.shared.dealerHasBlackjack()) {
      this.record.outcome = HandOutcomeEnum.BLACKJACK;
      this.player.hadBlackJackLastHand = true;
      this.player.payBankroll(amount)
      this.record.winnings += amount;
      this.hasBeenPaid = true;
    }
  }

  payBust(): void {
    this.player.payBankroll((-1) * this.betAmount);
    this.record.winnings -= this.betAmount;
    this.record.outcome = HandOutcomeEnum.BUSTED;
    this.hasBeenPaid = true;
  }

  getOptions(): void {
    this.options = [HandOptionEnums.STAY];
    if(this.isSurrenderable()) {
      this.options.push(HandOptionEnums.SURRENDER);
    }
    if(this.isHittable()) {
      this.options.push(HandOptionEnums.HIT);
    }
    if(this.isDoubleable()) {
      this.options.push(HandOptionEnums.DOUBLE);
    }
    if(this.isDoubleUpable()) {
      this.options.push(HandOptionEnums.DOUBLE_UP);
    }
    if(this.isSplittable()) {
      this.options.push(HandOptionEnums.SPLIT);
    }
  }

  isHittable(): boolean {
    if(!this.isBust()) {
      if(this.isFromSplitAces() ) {
        return this.shared.getConditions().DSA
      }
      return this.getValue() < 21;
    } 
    return false
  }

  isSurrenderable(): boolean {
    return !this.isBust() && !this.isBlackJack() && this.shared.getConditions().lateSurrender;
  }

  isDoubleable(): boolean {
    const bankroll = this.player.bankroll;
    if( bankroll === 0 
      || this.isBlackJack()
      || this.cards.length !== 2
      || (!this.conditions.DAS && this.isFromSplit)
      || (this.getValue() === 21 && this.getSoftValue() === 21)
      || this.isBust()
      || (bankroll < this.betAmount && !this.conditions.DFL)) {
      return false;
    }
    return true;
  }

  isDoubleUpable(): boolean {
    const bankroll = this.player.bankroll;
    if( bankroll === 0 
      || this.isBlackJack()
      || this.cards.length !== 2
      || (bankroll < this.betAmount && !this.conditions.DFL)) {
      return false;
    }
    return true;
  }

  isSplittable(): boolean {
    if(this.handId < this.conditions.MHFS 
      && this.player.bankroll >= 2 * this.betAmount 
      && this.cards[0].cardValue === this.cards[1].cardValue) {
      return this.isFromSplitAces() 
        ? this.shared.getConditions().RSA && this.cards[0].cardValue === this.cards[1].cardValue
        : this.cards[0].cardValue === this.cards[1].cardValue;
    }
    return false;
  }

  payHand(): void {
    if(!this.hasBeenPaid) {
      const dealerHandValue = this.shared.getDealerHandValue();
      const dealerBusted = this.shared.getDidDealerBust();
      let winnings: number = 0;
      if(dealerBusted) {
        this.record.outcome = HandOutcomeEnum.WON_BY_DEALER_BUST;
      } else if(dealerHandValue === 16) {
        this.record.outcome = HandOutcomeEnum.HALTED
      } else if(this.getValue() < dealerHandValue) {
        this.record.outcome = HandOutcomeEnum.LOST_TO_BETTER_HAND;
      } else if(this.getValue() === dealerHandValue) {
        this.record.outcome = HandOutcomeEnum.PUSHED
      } else {
        this.record.outcome = HandOutcomeEnum.WON_WITH_BETTER_HAND;
      }
      if(dealerHandValue === 16 && this.shared.getConditions().doubleUpLosesOnHalt) {
        if(this.is21()) {
          this.player.payBankroll(this.betAmount);
          winnings = this.betAmount;
        } else {
          this.player.payBankroll(-(this.doubleUpAmount));
          winnings = (-1) * (this.doubleUpAmount);
        }
      } else if(dealerHandValue === 16) {
        if(this.is21()) {
          this.player.payBankroll(this.betAmount);
          winnings = this.betAmount;
        }
      } else if(dealerBusted || this.getValue() > dealerHandValue) {
        this.player.payBankroll(this.betAmount);
        winnings = this.betAmount;
      } else if(this.getValue() < dealerHandValue) {
        this.player.payBankroll(-(this.betAmount));
        winnings = (-1) * (this.betAmount);
      } else if(this.getValue() === dealerHandValue && this.shared.getConditions().doubleUpLosesOnPush) {
        this.player.payBankroll(-(this.doubleUpAmount));
        winnings = (-1) * (this.doubleUpAmount);
      }
      this.hasBeenPaid = true;
      this.record.winnings += winnings;
    }
  }

  finalizeHandRecord(): void {
    this.record = this.getRecord(this.record);
  }
}