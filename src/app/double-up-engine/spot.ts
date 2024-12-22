import { TableSpot } from '../models-constants-enums/models';
import { SpotStatusEnum } from '../models-constants-enums/enumerations';
import { Hand } from './hand';
import { Card } from './card';

export class Spot {
  status: SpotStatusEnum = SpotStatusEnum.AVAILABLE;
  controlledBy: string = null;
  hands: Hand[] = [];
  id: number;

  constructor(spotInfo: TableSpot, public shared) {
    this.initializeSpot(spotInfo);
    this.shared = { 
      ...this.shared,
      getHandCount: () => this.getHandCount(),
      addHand: (x, y) => this.addHand(x, y), 
      seedSplitHand: (x) => this.seedSplitHand(x)
    };
  }

  removePlayer(): void {
    this.status = SpotStatusEnum.AVAILABLE;
    this.controlledBy = null;
    this.hands = [];
  }

  addHand(isFromSplit: boolean = false, originalBetSize: number = null): void {
    const player = this.shared.getPlayerBySpotId(this.id) || this.shared.getPlayerByHandle(this.controlledBy);
    let betSize = originalBetSize || player.betSize;
    if(isFromSplit && ((betSize * 2) > player.bankroll)) {
      betSize = player.bankroll - betSize;
    }
    this.hands.push(new Hand(this.id, this.shared, betSize, this.hands.length, isFromSplit));
  }

  seedSplitHand(card: Card): void {
    const index = this.hands.length - 1;
    this.hands[index].cards.push(card);
  }

  getHandCount(): number {
    return this.hands.length;
  }

  initializeSpot({ status, controlledBy, id }: TableSpot): void {
    this.status = status;
    this.controlledBy = controlledBy;
    if(!this.id) {
      this.id = id + 1;
    }
  }

  hasUnpaidHands(): boolean {
    return this.hands.filter(h => !h.hasBeenPaid).length > 0;
  }

  getUnpaidHands(): Hand[] {
    return this.hands.filter(h => !h.hasBeenPaid)
  }

  resetHands(): void {
    this.hands.forEach(hand => hand.clearCards());
    this.hands = [];
  }

  unassignSpot(): void {
    this.status = SpotStatusEnum.AVAILABLE;
    this.controlledBy = null;
  }

  assignSpot(controlledBy: string): void {
    this.status = SpotStatusEnum.TAKEN;
    this.controlledBy = controlledBy;
  }

  offerInsurance(): void {
    this.hands.forEach(h => h.placeInsuranceBet());
  }

  payInsurance(): void {
    this.hands.forEach(h => h.payInsurance());
  }

  payDealersBlackjack(): void {
    this.hands[0].payDealersBlackjack(this.id);
  }

  payBlackjack(): void {
    this.hands[0].payBlackjack(this.id);
  }
}