import { 
  BetSpreadStrategy,
  CountingMethod, 
  InsurancePlan, 
  PlayerConfig,
  PlayerTableInfo, 
  PlayStrategy,
  TableSpot,
  TippingPlan, 
  UnitResizeStrategy, 
  WongStrategy 
} from '../models-constants-enums/models';
import { 
  ChipTypeEnum,
  LocalStorageItemsEnum, 
  RoundingMethodEnum,
  SpotStatusEnum,
  TrueCountTypeEnum, 
} from '../models-constants-enums/enumerations';
import { LocalStorageService } from '../services/local-storage.service';
import { InsuranceHistory } from '../insurance-history/insurnce-history';

export class Player {
  handle: string;
  resizeProgression: number[] = [];
  bettingUnit: number;
  bankroll: number;
  originalBankroll: number;
  playingStrategy: PlayStrategy;
  betSpreadingStrategy: BetSpreadStrategy;
  unitResizingStrategy: UnitResizeStrategy;
  wongingStrategy: WongStrategy;
  tippingStrategy: TippingPlan;
  countingMethod: CountingMethod;
  insurancePlan: InsurancePlan;
  spotIds: number[] = [];
  wongSpotIds: number[] = [];
  tipSize: number = 0;
  tipAmountThisRound: number = 0;
  tippedAwayTotal: number = 0;
  totalBet: number = 0;
  totalInsuranceBet: number = 0;
  totalInsurancePaid: number = 0;
  spotId: number;
  hadBlackJackLastHand: boolean = false;
  betSizeLastHand: number;
  betSize: number = null;
  trueCountType: TrueCountTypeEnum;
  beginningTrueCount: number;
  insuranceHistory: InsuranceHistory = new InsuranceHistory();
  hasUpdatedInsuranceHistory: boolean = false;

  constructor(
    playerInfo: PlayerTableInfo, 
    private localStorageService: LocalStorageService,
    public shared
  ){
    this.initializePlayer(playerInfo);
  }

  initializePlayer({ seatNumber, playerConfigTitle }: PlayerTableInfo): void {
    const skeleton: PlayerConfig = this.localStorageService.getItemOfItems(
      LocalStorageItemsEnum.PLAYER_CONFIG, 
      playerConfigTitle
    );
    this.spotId = seatNumber;
    this.handle = skeleton.title;
    this.bettingUnit = skeleton.initialBettingUnit;
    this.betSizeLastHand = this.bettingUnit;
    this.bankroll = skeleton.initialBankroll;
    this.originalBankroll = skeleton.initialBankroll;
    this.playingStrategy = { ...this.localStorageService.getItemOfItems(
      LocalStorageItemsEnum.PLAY,
      skeleton.playStrategyTitle
    )};
    this.betSpreadingStrategy = { ...this.localStorageService.getItemOfItems(
      LocalStorageItemsEnum.BET_SPREAD,
      skeleton.betSpreadStrategyTitle
    )};
    this.unitResizingStrategy = { ...this.localStorageService.getItemOfItems(
      LocalStorageItemsEnum.UNIT_RESIZE,
      skeleton.unitResizingStrategyTitle
    )};
    this.wongingStrategy = { ...this.localStorageService.getItemOfItems(
      LocalStorageItemsEnum.WONG,
      skeleton.wongingStrategyTitle
    )};
    this.tippingStrategy = { ...this.localStorageService.getItemOfItems(
      LocalStorageItemsEnum.TIPPING,
      skeleton.tippngStrategyTitle
    )};
    this.countingMethod = { ...this.localStorageService.getItemOfItems(
      LocalStorageItemsEnum.COUNT,
      skeleton.countStrategyTitle
    )};
    this.insurancePlan = { ...this.localStorageService.getItemOfItems(
      LocalStorageItemsEnum.INSURANCE,
      skeleton.insurancePlanTitle
    )};
    this.trueCountType = this.getTrueCountType();
    this.resizeProgression = this.initializeResizeProgression();
    this.addSpot(seatNumber);
    this.shared.addCountingMethod(this.countingMethod);
  }

  resizeRound(size: number): number {
    const roundingMethod = this.unitResizingStrategy.roundingMethod;
    const roundToNearest = this.unitResizingStrategy.roundToNearest;
    const ROUND_UP = RoundingMethodEnum.UP;
    const ROUND_DOWN = RoundingMethodEnum.DOWN;
    const WHITE_CHIP = ChipTypeEnum.WHITE;
    const RED_CHIP = ChipTypeEnum.RED;
    let betAmount = size;
    if(roundingMethod === ROUND_UP && roundToNearest === WHITE_CHIP && size % 1 === .5) {
      betAmount += .5;
    }
    if(roundingMethod === ROUND_DOWN && roundToNearest === WHITE_CHIP && size % 1 === .5) {
      betAmount -= .5;
    }
    if(roundingMethod === ROUND_UP && roundToNearest === RED_CHIP && size % 5 === 2.5) {
      betAmount += 2.5;
    }
    if(roundingMethod === ROUND_DOWN && roundToNearest === RED_CHIP && size % 5 === 2.5) {
      betAmount -= 2.5;
    }
    if(roundingMethod === ROUND_UP && roundToNearest === RED_CHIP && size % 5 === .5) {
      betAmount = Math.ceil(size / 5) * 5;
    }
    if(roundingMethod === ROUND_DOWN && roundToNearest === RED_CHIP && size % 5 === .5) {
      betAmount = Math.floor(size / 5) * 5;
    }
    return betAmount;
  }

  initializeResizeProgression(): number[] {
    return this.unitResizingStrategy.unitProgression.map(p => this.resizeRound(p * this.bettingUnit))
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

  updateInsuranceHistory() {
    if(!this.hasUpdatedInsuranceHistory) {
      const hasIt = this.shared.dealerHasBlackjack();
      let trueCount = this.getTrueCountByTenth().toString();
      if(!trueCount.includes('.')) {
        trueCount += '.0';
      }
      this.insuranceHistory.updateInsuranceRecordByCount(trueCount, hasIt);
      this.hasUpdatedInsuranceHistory = true;
    }
  }

  getTrueCountByTenth() {
    return this.shared.getTrueCountByTenth(this.countingMethod, this.trueCountType);
  }

  getTrueCount() {
    return this.shared.getTrueCount(this.countingMethod, this.trueCountType);
  }

  addSpot(id: number): void {
    this.spotIds.push(id);
  }

  abandonSpotById(spotId: number): void {
    this.spotIds = this.spotIds.filter(id => id !== spotId);
  }

  payBankroll(amount: number): void {
    this.bankroll = this.bankroll + amount;
  }

  setBetSize(): void {
    const roundBetToNearest = this.betSpreadingStrategy.roundBetToNearest;
    const indexes = Object.keys(this.betSpreadingStrategy.spreads).map(i => parseFloat(i));
    const minIndex: number = Math.min(...indexes);
    const maxIndex: number = Math.max(...indexes);
    const isOnlyPlayer = this.shared.getOccupiedActiveSpotCount() === 1;
    let key = parseFloat(this.getTrueCount());
    if(key < minIndex) {
      key = minIndex;
    }
    if(key > maxIndex) {
      key = maxIndex;
    }
    let betAmount = this.bettingUnit * this.betSpreadingStrategy.spreads[key];
    if(roundBetToNearest === ChipTypeEnum.WHITE && betAmount % 1 !== 0) {
      betAmount = Math.round(betAmount);
    } else if(roundBetToNearest === ChipTypeEnum.RED && betAmount % 5 !== 0) {
      let amountToRound = 5 - (betAmount % 5)
      betAmount += (amountToRound < 2.5 ? amountToRound : (-1)*(betAmount % 5));
    } else if(betAmount % 1 !== 0) {
      betAmount += Math.round(betAmount);
    }
    betAmount = Math.min(this.shared.getConditions().maxBet, betAmount);
    betAmount = Math.max(this.shared.getConditions().minBet, betAmount);
    this.betSize = betAmount;
    this.incTotalBet(this.betSize);
  }

  initializeRound(): void {
    this.hasUpdatedInsuranceHistory = false;
    this.resizeUnit();
    this.setBetSize(); 
    this.wongIn();
    this.tip();
    this.beginningTrueCount = this.getTrueCount();
  }

  incTotalBet(betSize: number): void {
    this.totalBet += betSize;
  }

  incTotalInsuranceBet(betSize: number): void {
    this.totalInsuranceBet += betSize;
  }

  incTotalInsurancePaid(amount: number): void {
    this.totalInsurancePaid += amount;
  }

  finalizeRound(): void {
    this.payBankroll(-(this.tipAmountThisRound));
    this.wongOut();
  }

  getRunningCount(): number {
    return this.shared.getRunningCount(this.countingMethod.title);
  }

  resizeUnit(): void {
    if(this.shared.isFreshShoe()) {
      const increaseAtProgression = [ ...this.unitResizingStrategy.increaseAtMultiple ];
      const decreaseAtProgression = [ ...this.unitResizingStrategy.decreaseAtMultiple ];
      const resizeProgression = [ ...this.resizeProgression ];
      const currentIndex = resizeProgression.indexOf(this.bettingUnit);
      if(this.bankroll > increaseAtProgression[currentIndex] && resizeProgression[currentIndex + 1]) {
        this.bettingUnit = resizeProgression[currentIndex + 1];
      } else if(decreaseAtProgression[currentIndex] && this.bankroll < decreaseAtProgression[currentIndex]) {
        this.bettingUnit = resizeProgression[currentIndex - 1];
      }
    }
  }

  tip(): void {
    const { tipToBetsizeRatios, maxTip, afterBlackjack, dealerJoins, dealerLeaves, tipFirstHandOfShoe,
    playerIncreasesBet, everyXHands, tipWongHands } = this.tippingStrategy;
    this.tipAmountThisRound = 0;
    if(tipToBetsizeRatios || maxTip) {
      const betSize = this.betSize;
      const ratio = tipToBetsizeRatios.find(ratio => ratio[1] >= betSize);
      this.tipSize = (ratio ? ratio[0] : maxTip) 
      const totalRoundsCount = this.shared.getTotalRoundsDealt();
      const handsPerDealer = this.shared.getConditions().handsPerDealer;
      const wongedHandsToTip = tipWongHands ? this.wongSpotIds.length : 0;
      if((afterBlackjack && this.hadBlackJackLastHand)
        || (totalRoundsCount % handsPerDealer === handsPerDealer - 1 && dealerLeaves)
        || (totalRoundsCount % handsPerDealer === handsPerDealer && dealerJoins && totalRoundsCount !== 0)
        || (this.shared.isFreshShoe() && tipFirstHandOfShoe)
        || (playerIncreasesBet && this.betSizeLastHand < betSize)
        || (everyXHands && (totalRoundsCount % everyXHands) === 0 && totalRoundsCount !== 0)) {
        this.tipAmountThisRound = this.tipSize * (1 + wongedHandsToTip)
      }
      this.tippedAwayTotal += this.tipAmountThisRound;
      this.hadBlackJackLastHand = false;
      this.betSizeLastHand = betSize;
    }
  }

  increaseTipAmountThisRound(amount: number): void {
    this.tipAmountThisRound += amount;
    this.tippedAwayTotal += amount;
  }

  tipSplitHands(fromWong: boolean): void {
    const { tipSplitHandToo, tipWongHands } = this.tippingStrategy;
    if(tipSplitHandToo && (!fromWong || tipWongHands)) {
      this.increaseTipAmountThisRound(this.tipSize);
    }
  }

  doubleTip(fromWong: boolean, fromSplit: boolean): void {
    const { doubleDownTip, tipSplitHandToo, tipWongHands } = this.tippingStrategy;
    if(doubleDownTip && (!fromWong || tipWongHands) && (!fromSplit || tipSplitHandToo)) {
      this.increaseTipAmountThisRound(this.tipSize);
    }
  }

  doubleUpTip(fromWong: boolean, fromSplit: boolean): void {
    const { doubleUpTip, tipSplitHandToo, tipWongHands } = this.tippingStrategy;
    if(doubleUpTip && (!fromWong || tipWongHands) && (!fromSplit || tipSplitHandToo)) {
      this.increaseTipAmountThisRound(this.tipSize);
    }
  }

  insureTip(fromWong: boolean): void {
    const { insureTip, tipWongHands } = this.tippingStrategy;
    if(insureTip && (!fromWong || tipWongHands)) {
      this.increaseTipAmountThisRound(this.tipSize);
    }
  }

  wongIn(): void {
    const trueCount = this.getTrueCount();
    const wongedHands = this.wongingStrategy.wongedHands;
    for(let i = 0; i < wongedHands.length; i++) {
      const playerSpots = [ ...this.wongSpotIds, this.spotId ];
      const minSpotId = Math.min( ...playerSpots);
      const maxSpotId = Math.max( ...playerSpots);
      if(trueCount >= wongedHands[i].exitBelow) {
        if(wongedHands[i].isActive || trueCount >= wongedHands[i].enterAt) {
          let newSpotId = null;
          if(minSpotId > 1 && this.shared.isSpotAvailable(minSpotId - 1)) {
            newSpotId = minSpotId - 1;
          } else if(maxSpotId < this.shared.getConditions().spotsPerTable) {
            newSpotId = maxSpotId + 1;
          }
         if(newSpotId) {
          wongedHands[i].isActive = true;
          this.wongSpotIds.push(newSpotId);
          this.addSpot(newSpotId);
          const tableSpot: TableSpot = {
            status: SpotStatusEnum.TAKEN,
            controlledBy: this.handle,
            id: null,
          }
          this.shared.getSpotById(newSpotId).initializeSpot(tableSpot);
          this.incTotalBet(this.betSize);
         }
        }
      } else {
        wongedHands[i].isActive = false;
      }
    }
  }

  wongOut(): void {
    this.wongSpotIds.forEach(id => this.shared.getSpotById(id).removePlayer());
    this.spotIds = [this.spotId];
    this.wongSpotIds = [];
  }
}