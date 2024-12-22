import { 
  Conditions,
  CountingMethod,
  PlayStrategyCombo, 
  ShoeConditions, 
} from '../models-constants-enums/models';
import { LocalStorageItemsEnum, TrueCountTypeEnum } from '../models-constants-enums/enumerations';
import { DeviationPlayer } from './deviation-player'
import { LocalStorageService } from '../services/local-storage.service';
import { Shoe } from '../double-up-engine/shoe';
import { DeviationDealerHand } from './deviation-dealer-hand';
import { DeviationInfo, dealerUpCards } from './deviation-results/deviation-models';

export class DeviationTable {
  conditions: Conditions;
  spotCount: number;
  shoe: Shoe;
  players: DeviationPlayer[] = [];
  iterations: number;
  playedRounds: number = 0;
  totalRoundsDealt: number = 0;
  dealerHand: DeviationDealerHand; 
  instances: number = 0;
  playerCards: string;

  constructor(
    private deviationInfo: DeviationInfo,
    private localStorageService: LocalStorageService,
    public shared: any
  ) {
    this.conditions = this.localStorageService.getItemOfItems(
      LocalStorageItemsEnum.CONDITIONS, 
      "Deviation Conditions"
    );
    this.conditions = { ...this.conditions, ...this.deviationInfo.variableConditions };
    this.iterations = this.deviationInfo.instances;
    this.playerCards = this.deviationInfo.playerCards;
    this.initializeShoe();
    this.shared = {
      ...shared,
      addCountingMethod: (x: CountingMethod) => this.shoe.addCountingMethod(x),
      discard: (x) => this.shoe.discard(x),
      deal: () => this.shoe.deal(),
      getTrueCount: (x: CountingMethod, y: TrueCountTypeEnum) => this.shoe.getTrueCount(x, y),
      getRunningCount: (x: string) => this.shoe.getRunningCountsByMethodName(x),
      getDealerUpCard: () => this.dealerHand.cards[0].cardValue.toString(),
      getDidDealerBust: () => this.dealerHand.isBust(),
      getDealerHandValue: () => this.dealerHand.getValue(),
      isFreshShoe: () => this.shoe.getIsFreshShoe(),
      getTotalRoundsDealt: () => this.totalRoundsDealt,
      getConditions: (): Conditions => this.conditions,
      hasActivePlayers: (): Boolean => this.hasActivePlayers()
    };
    this.dealerHand = new DeviationDealerHand(this.shared)
    this.initializeTable();
    this.play();
  }

  play() {
    while(this.playedRounds < this.iterations) {
      this.initializeRound();
      this.deal();
      if(this.isValidDeal()) {
        this.removeInvalidHands();
        this.playHands();
        this.playDealersHand();
        this.payHands();
        // console.log(this.dealerHand.cards.map(c => c.name).join(' '));
        // console.log('________________________');
      }
      this.finalizeRound();
    }
    this.shared.hideDeviationResultsSpinner();
    this.shared.showDeviationResults();
  }

  hasActivePlayers(): boolean {
    let hasActivePlayers: boolean = false;
    this.players.forEach(p => p.hands.forEach(h => {
      if(!h.hasBeenPaid) {
        hasActivePlayers = true;
      }
    }))
    return hasActivePlayers;
  }

  isValidDeal(): boolean {
    if(this.dealerHand.hasBlackjack()) {
      return false
    }
    let isValid: boolean = false;
    this.players.forEach(p => {
      if(p.hands[0].createChartKey().split('-')[1] === this.playerCards) {
        p.setHasValidDeal(true);
        isValid = true;
      }
    })
    return isValid;
  }

  removeInvalidHands(): void {
    this.players.filter(p => !p.hasValidDeal).forEach(p => p.resetHands())
  }

  initializeShoe() {
    const shoeConditions: ShoeConditions = {
      decksPerShoe: this.conditions.decksPerShoe,
      cardsBurned: this.conditions.cardsBurned,
      shufflePoint: this.conditions.shufflePoint,
      countBurnCard: this.conditions.countBurnCard
    };
    this.shoe = new Shoe(shoeConditions, this.localStorageService);
  }

  initializeTable() {
    this.spotCount = this.conditions.spotsPerTable;
    this.instances = this.deviationInfo.instances;
    this.initializePlayers();
  }

  initializePlayers() {
    this.players = this.deviationInfo.actions
      .filter(a => a !== 'Surrender')
      .map((action, i) => (new DeviationPlayer({ 
        seatNumber: i + 1, 
        playerConfigTitle: action,
        playStrategyTitle: this.deviationInfo.playStrategyTitle,
        countingMethodTitle: this.deviationInfo.countingMethodTitle,
      }, this.localStorageService, this.getPlayStrategyCombo(action), this.shared)));
  }

  getPlayStrategyCombo(action: string): PlayStrategyCombo[] {
    const actionMap = {
      "Hit": "H ST",
      "Stay": "ST",
      "Double": "DD ST",
      "DoubleUp": "DU ST",
      "Split": "SP ST"
    };
    let combos: PlayStrategyCombo[] = [];
    dealerUpCards.map(c => c === 'T' ? 10 : c).forEach(card => combos.push({ [`${card}-${this.deviationInfo.playerCards}`]: {
      conditions: "",
      options: actionMap[action]
    }}))
    return combos;
  }

  deal() {
    this.shoe.incHandCount();
    this.players.forEach(p => p.addHand());
    this.players.forEach(({ hands }) => hands.forEach(({ cards }) => cards.push(this.shoe.deal())));
    this.dealerHand.cards.push(this.shoe.deal());
    this.players.forEach(({ hands }) => hands.forEach(({ cards }) => cards.push(this.shoe.deal())));
    this.dealerHand.cards.push(this.shoe.dealHoleCard());
    this.totalRoundsDealt++;
  }

  initializeRound() {
    this.players.forEach(p => p.initializeRound());
  }

  finalizeRound() {
    this.dealerHand.clearCards();
    this.players.forEach(p => p.finalizeRound());
    this.shoe.shuffleCheck();
    this.playedRounds += 1;
  }

  playHands() {
    this.players.filter(p => p.hasValidDeal).length
    this.players.filter(p => p.hasValidDeal).forEach(p => p.playHands());
  }

  payHands() {
    this.players.filter(p => p.hasValidDeal).forEach(p => p.hands.forEach(h => h.payHand()));
  }

  playDealersHand() {
    this.shoe.flipHoleCard(this.dealerHand.cards[1]);
    this.dealerHand.playHand();
  }
}