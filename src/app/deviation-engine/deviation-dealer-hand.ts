import { Card } from '../double-up-engine/card';

export class DeviationDealerHand {
  cards: Card[] = [];

  constructor(private shared) {}

  clearCards() {
    this.shared.discard(this.cards);
    this.cards = [];
  }

  showsAce() {
    return this.cards[0].cardValue === 1;
  }

  hasBlackjack(): boolean {
    return this.cards.length === 2 && this.getValue() === 21;
  }

  hasAce() {
    return this.cards.filter(card => card.cardValue === 1).length > 0;
  }

  getSoftValue() {
    let value = 0;
    this.cards.forEach(card => value += card.cardValue);
    return value;
  }

  getValue(): number {
    let value = 0;
    this.cards.forEach(card => value += card.cardValue);
    if(this.hasAce()) {
      value = (value + 10) > 21 ? value : (value + 10);
    }
    return value;
  }

  is21() {
    return this.getValue() === 21;
  }
  
  isBust() {
    return this.getValue() > 21;
  }

  playHand(): void {
    const S17 = this.shared.getConditions().S17;
    let drawCondition: boolean = this.getValue() < 16 
      || (!S17 && this.hasAce() && this.getValue() === 17 && this.getValue() !== this.getSoftValue());
    while(drawCondition && this.shared.hasActivePlayers()) {
      this.cards.push(this.shared.deal());
      drawCondition = this.getValue() < 16 
      || (!S17 && this.hasAce() && this.getValue() === 17 && this.getValue() !== this.getSoftValue());
    }
  }

  finalizeRecord() {}
}