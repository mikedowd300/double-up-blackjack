import { TableSpot, TableSpotsInformation } from '../models-constants-enums/models';
import { SpotStatusEnum } from '../models-constants-enums/enumerations';
import { Spot } from './spot';

export class SpotManager {

  spots: Spot[] = [];

  constructor(private spotsInfo: TableSpotsInformation, private shared) {
    this.initializeSpots(this.spotsInfo);
  }

  initializeSpots({ spotsPertable, playerSpotMap }: TableSpotsInformation): void {
    for(let s = 0; s < spotsPertable; s++) {
      const controlledBy = Object.keys(playerSpotMap)
        .find(player => playerSpotMap[player] === (s + 1));
      const spot: TableSpot = { 
        status:  controlledBy ? SpotStatusEnum.TAKEN : SpotStatusEnum.AVAILABLE,
        controlledBy: controlledBy ? controlledBy : null,
        id: s
      };
      this.spots.push(new Spot(spot, this.shared));
    }
  }

  isSpotAvailable(id: number): boolean {
    return this.getSpotById(id).status === SpotStatusEnum.AVAILABLE
  }

  getSpotById(id: number): Spot {
    return this.spots.find(s => s.id === id);
  }

  getTakenSpots(): Spot[] {
    return this.spots.filter(({ status }) => status === SpotStatusEnum.TAKEN);
  }

  getTakenUnpaidSpots(): Spot[] {
    return this.getTakenSpots().filter(spot => spot.hasUnpaidHands());
  }

  offerInsurance(): void {
    this.getTakenSpots().forEach(spot => spot.offerInsurance());
  }

  payInsurance(): void {
    this.getTakenSpots().forEach(spot => spot.payInsurance());
  }

  payDealersBlackjack(): void {
    this.getTakenSpots().forEach(spot => spot.payDealersBlackjack());
  }

  payBlackjacks(): void {
    this.getTakenUnpaidSpots().forEach(spot => spot.payBlackjack());
  }

  playHands(): void {
    this.getTakenUnpaidSpots().forEach(spot => {
      // spot.hands.forEach(h => h.playHand())
      spot.hands[0].playHand();
      spot.hands[1]?.playHand();
      spot.hands[2]?.playHand();
      spot.hands[3]?.playHand();
      spot.hands[4]?.playHand();
      spot.hands[5]?.playHand();
      spot.hands[6]?.playHand();
    })
  }

  payHands(): void {
    this.getTakenUnpaidSpots().forEach(spot => spot.getUnpaidHands().forEach(h => h.payHand()))
  }
}