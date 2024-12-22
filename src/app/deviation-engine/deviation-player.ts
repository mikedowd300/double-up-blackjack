import { CountingMethod, PlayStrategy, PlayStrategyCombo } from '../models-constants-enums/models';
import { 
  LocalStorageItemsEnum, 
  RoundingMethodEnum,
  TrueCountTypeEnum, 
} from '../models-constants-enums/enumerations';
import { LocalStorageService } from '../services/local-storage.service';
import { DeviationPlayerTableInfo, PlayActionsEnum } from './deviation-results/deviation-models';
import { DeviationHand } from './deviation-hand'
import { Card } from '../double-up-engine/card';

export class DeviationPlayer {
  handle: string;
  bettingUnit: number;
  bankroll: number;
  originalBankroll: number;
  playingStrategy: PlayStrategy;
  countingMethod: CountingMethod;
  totalBet: number = 0;
  totalInsuranceBet: number = 0;
  totalInsurancePaid: number = 0;
  amountBetPerHand: number = 0;
  betSize: number = 100;
  trueCountType: TrueCountTypeEnum;
  beginningTrueCount: number;
  hands: DeviationHand[] = [];
  hasValidDeal: boolean = false;

  constructor(
    playerInfo: DeviationPlayerTableInfo, 
    private localStorageService: LocalStorageService,
    public playStrategySnippets: PlayStrategyCombo[],
    public shared
  ){
    this.initializePlayer(playerInfo);
    this.shared = {
      ...this.shared,
      payBankroll: (x: number, y: string, z: boolean) => this.payBankroll(x, y, z),
      getBankRoll: (): number => this.bankroll,
      incTotalBet: (x: number) => this.incTotalBet(x),
      getBetSize: (): number => this.betSize,
      addHand: (x: boolean = false, y: number = null) => this.addHand(x, y),
      seedSplitHand: (x: Card, y: string) => this.seedSplitHand(x, y),
    }
  }

  payBankroll(amount: number, chartKey: string, incInstance: boolean = true): void {
    const actionKey: PlayActionsEnum = this.handle.toLowerCase() as PlayActionsEnum;
    this.shared.updateResultsAmountWon(amount, this.beginningTrueCount, actionKey, chartKey, incInstance);
  }

  initializePlayer({ 
    seatNumber, 
    playerConfigTitle, 
    playStrategyTitle, 
    countingMethodTitle 
  }: DeviationPlayerTableInfo): void {
    this.handle = playerConfigTitle;
    this.bettingUnit = 100;
    this.bankroll = 1000000000;
    this.originalBankroll = 1000000000;
    this.playingStrategy = { ...this.localStorageService.getItemOfItems(
      LocalStorageItemsEnum.PLAY,
      playStrategyTitle
    )};
    this.countingMethod = { ...this.localStorageService.getItemOfItems(
      LocalStorageItemsEnum.COUNT,
      countingMethodTitle
    )};
    this.includeSnippets();
    this.trueCountType = this.getTrueCountType();
    this.shared.addCountingMethod(this.countingMethod);
  }

  includeSnippets() {
    this.playStrategySnippets.forEach(snippet => {
      const chartKey = Object.keys(snippet)[0];
      this.playingStrategy.combos[chartKey] = snippet[chartKey]
    })
  }

  getTrueCountType(): TrueCountTypeEnum {
    if(this.countingMethod.useHalfCount) {
      if(this.countingMethod.roundingMethod === RoundingMethodEnum.OFF) {
        return TrueCountTypeEnum.HALF_ROUNDED;
      } else {
        return TrueCountTypeEnum.HALF_FLOOR;
      }
    } else {
      return this.countingMethod.roundingMethod === RoundingMethodEnum.OFF
        ? TrueCountTypeEnum.FULL_ROUNDED
        : TrueCountTypeEnum.FULL_FLOOR;
    }
  }

  getTrueCount() {
    return this.shared.getTrueCount(this.countingMethod, this.trueCountType);
  }

  initializeRound(): void {
    this.beginningTrueCount = this.getTrueCount(); 
  }

  finalizeRound(): void {
    this.resetHands();
    this.hasValidDeal = false;
  }

  setHasValidDeal(status: boolean): void {
    this.hasValidDeal = status;
  }

  incTotalBet(betSize: number): void {
    this.totalBet += betSize;
    this.amountBetPerHand += betSize;
  }

  getRunningCount(): number {
    return this.shared.getRunningCount(this.countingMethod.title);
  }

  playHands(): void {
    // TODO - retry later with a forEach
    this.hands[0].playHand();
    this.hands[1]?.playHand();
    this.hands[2]?.playHand();
    this.hands[3]?.playHand();
    this.hands[4]?.playHand();
    this.hands[5]?.playHand();
    this.hands[6]?.playHand();
  }

  addHand(isFromSplit: boolean = false, originalBetSize: number = null) {
    let betSize = originalBetSize || this.betSize;
    if(isFromSplit && ((betSize * 2) > this.bankroll)) { // Split For Less
      betSize = this.bankroll - betSize;
    }
    this.hands.push(new DeviationHand(this.trueCountType, this.shared, betSize, this.playingStrategy.combos, this.hands.length, isFromSplit));
  }

  seedSplitHand(card: Card, splitFirst2CardsChartKey: string = '') {
    const index = this.hands.length - 1;
    this.hands[index].cards.push(card);
    this.hands[index].first2CardsChartKey = splitFirst2CardsChartKey;
    this.hands[index].isFromSplitNotFirst = true;
  }
  
  resetHands(): void {
    this.hands.forEach(hand => hand.clearCards());
    this.hands = [];
  }
}

