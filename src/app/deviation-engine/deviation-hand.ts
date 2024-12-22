import { Conditions } from '../models-constants-enums/models';
import { 
  HandOptionEnums, 
  PayRatioEnum, 
  TrueCountTypeEnum
} from '../models-constants-enums/enumerations';
import { playerFirst2  } from '../models-constants-enums/constants';
import { Card } from '../double-up-engine/card';

export class DeviationHand {
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
  decisionMap: { [k: string]: Function };
  decisionRecord: string[] = [];
  actionMap = {
    'ST': 'stay',
    'SP': 'split',
    'SR': 'surrender',
    'H': 'hit',
    'DD': 'double',
    'DU': 'doubleup',
  };
  cardMap = { 1: 'A', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: 'T' };
  dealerCardMap = { 1: 'A', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10' };
  conditions: Conditions;
  doubleUpAmount: number = 0;
  insuranceAmount: number = 0;
  chartKey: string;
  first2CardsChartKey: string;
  isFromSplitNotFirst: boolean = false;

  constructor(
    private trueCountType: TrueCountTypeEnum,
    private shared, 
    public betAmount: number,
    private playStrategy: any,
    private handId: number,
    public isFromSplit: boolean = false,
  ) {
    this.conditions = this.shared.getConditions();
    this.decisionMap = {
      'stay': () => this.stand(),
      'split': () => this.split(),
      'surrender': () => this.surrender(),
      'hit': () => this.hit(),
      'double': () => this.double(),
      'doubleup': () => this.doubleup()
    };
  }

  playHand() {
    if(this.isFromSplit && this.cards.length === 1) {
      this.cards.push(this.shared.deal());
    }
    if(!this.isBust()) { 
      this.getOptions();
      this.makeDecision();
    }
  }

  makeDecision() {
    this.chartKey = this.createChartKey();
    let options: string[] = this.playStrategy[this.chartKey].options
      .split(' ')
      .map(op => this.actionMap[op.trim()]);

    let conditions: string[] = this.playStrategy[this.chartKey].conditions
      .split(' ')
      .filter(c => c != '')
      .map(c => c.trim());

    while(conditions.length < options.length) {
      conditions.push('?')
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
    if(parseInt(condition)) {
      // check for index plays
      const countThreshold = parseInt(condition);
      const trueCount = this.shared.getTrueCount(this.trueCountType)
      // console.log(trueCount);
      return(trueCount >= countThreshold)
    }
    return true;
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
      if(!this.isFromSplit) {
        this.first2CardsChartKey = playerFirst2.includes(first2Cards)
          ? `${ this.dealerCardMap[this.shared.getDealerUpCard()] }-${ first2Cards }`
          : `${ this.dealerCardMap[this.shared.getDealerUpCard()] }-${ this.cards[0].cardValue + this.cards[1].cardValue }`;
      }
      return playerFirst2.includes(first2Cards)
        ? `${ this.dealerCardMap[this.shared.getDealerUpCard()] }-${ first2Cards }`
        : `${ this.dealerCardMap[this.shared.getDealerUpCard()] }-${ this.cards[0].cardValue + this.cards[1].cardValue }`;
    } 
    return this.getValue() === this.getSoftValue()
      ? `${ this.dealerCardMap[this.shared.getDealerUpCard()] }-${ this.getValue() }`
      : `${ this.dealerCardMap[this.shared.getDealerUpCard()] }-A${ this.getSoftValue() - 1 }`;
  }

  stand() {}

  hit() {
    // console.log('HIT');
    this.cards.push(this.shared.deal());
    if(this.isBust()) {
      this.payBust();
    } else if(!this.is21()) {
      this.playHand();
    } 
  }

  double() {
    // console.log('DOUBLE');
    const bankroll = this.shared.getBankRoll();
    this.shared.incTotalBet(this.betAmount); // Careful not to inc the original bet amount too
    this.betAmount = bankroll < (2 * this.betAmount) ? bankroll : 2 * this.betAmount;
    this.cards.push(this.shared.deal());
    if(this.isBust()) {
      this.payBust();
    }
  }

  doubleup() {
    // console.log('DOUBLE UP');
    this.doubleUpAmount = this.shared.getBankRoll() < this.betAmount 
      ? this.shared.getBankRoll() 
      : this.betAmount;
    this.shared.incTotalBet(this.doubleUpAmount);
    this.betAmount += this.doubleUpAmount;
    this.stand();
  }

  split() {
    // console.log('SPLIT');
    const bankroll = this.shared.getBankRoll();
    this.shared.incTotalBet(this.shared.getBetSize());
    this.shared.addHand(true, this.betAmount);
    this.shared.seedSplitHand(this.cards.pop(), this.first2CardsChartKey);
    this.cards.push(this.shared.deal());
    this.isFromSplit = true;
    this.playHand();
  }

  surrender(): void {
    // console.log('SURRENDER');
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
    this.displayHand(this.betAmount / (-2))
    this.shared.payBankroll(this.betAmount / (-2), this.first2CardsChartKey, !this.isFromSplitNotFirst)
    this.hasBeenPaid = true;
  }

  payBlackjack(spotId: number): void {
    const amount = this.betAmount * this.payRatioMap[this.conditions.payRatio];
    if(!this.hasBeenPaid && this.hasBlackjack() && !this.shared.dealerHasBlackjack()) {
      this.displayHand(amount)
      this.shared.payBankroll(amount, this.first2CardsChartKey, !this.isFromSplitNotFirst)
      this.hasBeenPaid = true;
    }
  }

  payBust() {
    this.displayHand((-1) * this.betAmount)
    this.shared.payBankroll((-1) * this.betAmount, this.first2CardsChartKey, !this.isFromSplitNotFirst);
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
      if(this.isFromSplitAces()) {
        return this.shared.getConditions().DSA && this.getValue() < 21;
      }
      return this.getValue() < 21;
    } 
    return false
  }

  isSurrenderable(): boolean {
    return !this.isBust() && !this.isBlackJack() && this.shared.getConditions().lateSurrender;
  }

  isDoubleable(): boolean {
    const bankroll = this.shared.getBankRoll();
    if( bankroll === 0 
      || this.isBlackJack()
      || this.cards.length !== 2
      || (!this.conditions.DAS && this.isFromSplit)
      || (this.getValue() === 21 && this.getSoftValue() === 21)
      || this.isBust()) {
      return false;
    }
    return true;
  }

  isDoubleUpable(): boolean {
    const bankroll = this.shared.getBankRoll();
    if( bankroll === 0 
      || this.isBlackJack()
      || this.cards.length !== 2
      || (bankroll < this.betAmount && !this.conditions.DFL)) {
      return false;
    }
    return true;
  }

  isSplittable() {
    if(this.handId < this.conditions.MHFS 
      && this.shared.getBankRoll() >= 2 * this.betAmount 
      && this.cards[0].cardValue === this.cards[1].cardValue) {
      return this.isFromSplitAces() 
        ? this.shared.getConditions().RSA && this.cards[0].cardValue === this.cards[1].cardValue
        : this.cards[0].cardValue === this.cards[1].cardValue;
    }
    return false;
  }

  payHand() {
    if(!this.hasBeenPaid) {
      const dealerHandValue = this.shared.getDealerHandValue();
      const dealerBusted = this.shared.getDidDealerBust();
      if(dealerHandValue === 16 && this.shared.getConditions().doubleUpLosesOnHalt) {
        if(this.is21()) {
          this.displayHand(this.betAmount);
          this.shared.payBankroll(this.betAmount, this.first2CardsChartKey, !this.isFromSplitNotFirst);
        } else {
          this.displayHand(-(this.doubleUpAmount));
          this.shared.payBankroll(-(this.doubleUpAmount), this.first2CardsChartKey, !this.isFromSplitNotFirst);
        }
      } else if(dealerHandValue === 16) {
        if(this.is21()) {
          this.displayHand(this.betAmount);
          this.shared.payBankroll(this.betAmount, this.first2CardsChartKey, !this.isFromSplitNotFirst);
        } else {
          this.displayHand(0);
          this.shared.payBankroll(0, this.first2CardsChartKey, !this.isFromSplitNotFirst);
        }
      } else if(dealerBusted || this.getValue() > dealerHandValue) {
        this.displayHand(this.betAmount);
        this.shared.payBankroll(this.betAmount, this.first2CardsChartKey, !this.isFromSplitNotFirst);
      } else if(this.getValue() < dealerHandValue) {
        this.displayHand(-(this.betAmount));
        this.shared.payBankroll(-(this.betAmount), this.first2CardsChartKey, !this.isFromSplitNotFirst);
      } else if(this.getValue() === dealerHandValue && this.shared.getConditions().doubleUpLosesOnPush) {
        this.displayHand(-(this.doubleUpAmount));
        this.shared.payBankroll(-(this.doubleUpAmount), this.first2CardsChartKey, !this.isFromSplitNotFirst);
      } else if(this.getValue() === dealerHandValue) {
        this.displayHand(0);
        this.shared.payBankroll(0, this.first2CardsChartKey, !this.isFromSplitNotFirst);
      }
      this.hasBeenPaid = true;
    }
  }

  displayHand(winnings) {
    // console.log(this.cards.map(c => c.name).join(' '), ':', this.getValue());
    // console.log('BET:', this.betAmount, "WON:", winnings);
  }

  finalizeHandRecord() {}
}