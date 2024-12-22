import { 
  Conditions,
  CountingMethod,
  PlayerTableInfo, 
  ShoeConditions, 
  SimInfo,
  TableSpotsInformation,
} from '../models-constants-enums/models';
import { LocalStorageItemsEnum, SpotStatusEnum, TrueCountTypeEnum } from '../models-constants-enums/enumerations';
import { Player } from './player';
import { LocalStorageService } from '../services/local-storage.service';
import { Shoe } from './shoe';
import { SpotManager } from './spot-manager';
import { DealerHand } from './dealer-hand'
import { History } from '../history/table-record-history';
import { DealerRecord } from '../history/history-models';

export class Table {
  conditions: Conditions;
  spotCount: number;
  shoe: Shoe;
  players: Player[] = [];
  iterations: number;
  playedRounds: number = 0;
  spotManager: SpotManager;
  totalRoundsDealt: number = 0;
  dealerHand: DealerHand; 
  history: History = new History();
  shared

  constructor(
    private simInfo: SimInfo,
    private localStorageService: LocalStorageService,
  ) {
    this.conditions = this.localStorageService.getItemOfItems(
      LocalStorageItemsEnum.CONDITIONS, 
      this.simInfo?.tableSkeleton.conditionsTitle
    );
    this.initializeShoe();
    this.shared = {
      addCountingMethod: (x: CountingMethod) => this.shoe.addCountingMethod(x),
      getPlayerBySpotId: (x) => this.getPlayerBySpotId(x),
      getPlayerByHandle: (x: string) => this.getPlayerByHandle(x),
      discard: (x) => this.shoe.discard(x),
      deal: () => this.shoe.deal(),
      getTrueCount: (x: CountingMethod, y: TrueCountTypeEnum) => this.shoe.getTrueCount(x, y),
      getTrueCountByTenth: (x: CountingMethod, y: TrueCountTypeEnum) => this.shoe.getTrueCountByTenth(x, y),
      getRunningCount: (x: string) => this.shoe.getRunningCountsByMethodName(x),
      dealerHasBlackjack: () => this.dealerHasBlackjack(),
      getDealerUpCard: () => this.getDealerUpCard(),
      getDidDealerBust: () => this.getDidDealerBust(),
      getDealerHandValue: () => this.getDealerHandValue(),
      getDealerRecord: (x: DealerRecord) => this.history.getDealerRecord(x),
      getOccupiedActiveSpotCount: () => this.getOccupiedActiveSpotCount(),
      getSpotById: (x) => this.spotManager.getSpotById(x),
      isFreshShoe: () => this.shoe.getIsFreshShoe(),
      isSpotAvailable: (x) => this.spotManager.isSpotAvailable(x),
      getTotalRoundsDealt: () => this.totalRoundsDealt,
    };
    this.initializeTable(this.simInfo.tableSkeleton.players);
    this.play();
  }

  initializeShoe(): void  {
    const shoeConditions: ShoeConditions = {
      decksPerShoe: this.conditions.decksPerShoe,
      cardsBurned: this.conditions.cardsBurned,
      shufflePoint: this.conditions.shufflePoint,
      countBurnCard: this.conditions.countBurnCard
    };
    this.shoe = new Shoe(shoeConditions, this.localStorageService);
  }

  initializeTable(players: PlayerTableInfo[]): void  {
    this.spotCount = this.conditions.spotsPerTable;
    this.iterations = this.simInfo.iterations;
    const spotInfo: TableSpotsInformation = { 
      spotsPertable: this.conditions.spotsPerTable,
      playerSpotMap: this.getPlayerSpotMap(players),
    };
    this.shared.getConditions = () => this.conditions;
    this.spotManager = new SpotManager(spotInfo, this.shared);
    players.forEach(p => this.players.push(new Player(p, this.localStorageService, this.shared)));
    this.dealerHand = new DealerHand(this.shared);
  }

  getPlayerSpotMap(players: PlayerTableInfo[]): {[k: string]: number} {
    let playerSpotMap: {[k: string]: number} = {};
    players.forEach(p => playerSpotMap[p.playerConfigTitle] = p.seatNumber);
    return playerSpotMap;
  }

  getOccupiedActiveSpotCount(): number {
    return this.spotManager.spots.filter(s => s.status === SpotStatusEnum.TAKEN).length;
  }

  deal(): void  {
    this.shoe.incHandCount();
    this.spotManager.getTakenSpots().forEach(spot => spot.addHand());
    this.spotManager.getTakenSpots()
      .forEach(({ hands }) => hands
      .forEach(({ cards }) => cards.push(this.shoe.deal())));
    this.dealerHand.cards.push(this.shoe.deal());
    this.spotManager.getTakenSpots()
      .forEach(({ hands }) => hands
      .forEach(({ cards }) => cards.push(this.shoe.deal())));
    this.dealerHand.cards.push(this.shoe.dealHoleCard());
    this.totalRoundsDealt++;
  }

  initializeRound(): void  {
    this.players.forEach(p => p.initializeRound());
  }

  initializeRecord(): void  {
    this.history.createNewRecord();
    this.players.forEach(p => this.history.addPlayersRecord({
      bettingUnit: p.betSize,
      handle: p.handle,
      beginningBankroll: p.bankroll,
      beginningTrueCount: p.beginningTrueCount,
      beginningRunningCount: p.getRunningCount(),
      trueCountType: p.trueCountType,
      tipped: 0,
    }));
    this.spotManager.spots.forEach(s => {
      if(s.status === SpotStatusEnum.TAKEN) {
        this.history.addSpotsRecordWithEmptyHands({
          spotId: s.id,
          playerHandle: s.controlledBy,
          hands: [],
          insuredAmount: null,
          countWhenInsured: null,
        })
      } else {
        this.history.addSpotsRecordWithEmptyHands(null);
      };
    })
  }

  finalizeRound(): void  {
    this.spotManager.getTakenSpots().forEach(spot => spot.resetHands());
    this.dealerHand.clearCards();
    this.shoe.shuffleCheck();
    this.playedRounds += 1;
    this.removeBrokePlayers();
    this.players.forEach(p => p.finalizeRound());
  }

  finalizeRecord(): void  {
    this.dealerHand.finalizeRecord();
    this.spotManager.spots.forEach(s => {
      if(s.status === SpotStatusEnum.TAKEN) {
        s.hands.forEach(h => {
          h.finalizeHandRecord();
          this.history.addHandRecordToSpotRecordById(s.id, h.record)
        })
      }
    })
    this.players.forEach(p => this.history.activeRecord.players.find(ap => ap.handle === p.handle).tipped = p.tipAmountThisRound);
    this.history.finalizeRecord();
  }

  play(): void  {
    let hasSpots: boolean = this.spotManager.spots
      .filter(s => s.status === SpotStatusEnum.TAKEN).length > 0;
    while(this.playedRounds < this.iterations && hasSpots) {
      this.initializeRound();
      this.initializeRecord();
      this.deal();
      this.offerInsurance();
      this.payInsurance();
      this.handleDealerBlackjack();
      this.payPlayersBlackjacks();
      this.playHands();
      this.playDealersHand();
      this.payHands();
      this.finalizeRecord();
      this.finalizeRound();
      hasSpots = this.spotManager.spots.filter(s => s.status === SpotStatusEnum.TAKEN).length > 0;
    }
    this.players.forEach(p => console.log(`${p.handle}, bankroll:${p.bankroll}, total-bet:${p.totalBet} roi: ${Math.round(((p.bankroll - p.originalBankroll) * 10000) / p.totalBet) / 100}%`));
  }

  payInsurance(): void  {
    if(this.dealerHand.showsAce()) {
      this.spotManager.payInsurance();
    }
  }

  getPlayerBySpotId(spotId: number): Player {
    return this.players.find(({ spotIds }) => spotIds.includes(spotId))
  }

  getPlayerByHandle(handle: string): Player {
    return this.players.find(p => p.handle === handle)
  }

  removePlayerFromSpotsByHandle(handle): void  {
    const spotIds = this.getPlayerByHandle(handle).spotIds
    spotIds.forEach(id => this.spotManager.getSpotById(id).removePlayer());
  }

  removeBrokePlayers(): void  {
    let brokePlayerHandles: string[] = []
    this.players
      .filter(p => p.bankroll < this.conditions.minBet)
      .forEach(p => {
        brokePlayerHandles.push(p.handle);
        this.removePlayerFromSpotsByHandle(p.handle)
      });
    this.players = this.players.filter(p => !brokePlayerHandles.includes(p.handle));
  }

  playHands(): void  {
    if(!this.dealerHand.hasBlackjack()) {
      this.spotManager.playHands()
    }
  }

  offerInsurance(): void  {
    if(this.dealerHand.showsAce()) {
      this.spotManager.offerInsurance();
    }
  }

  handleDealerBlackjack(): void  {
    if(this.dealerHand.hasBlackjack()) { 
      this.spotManager.payDealersBlackjack();
    }
  }

  payHands(): void  {
    if(!this.dealerHand.hasBlackjack() && this.spotManager.getTakenUnpaidSpots().length > 0) {
      this.spotManager.payHands();
    }
  }

  playDealersHand(): void  {
    this.shoe.flipHoleCard(this.dealerHand.cards[1]);
    if(!this.dealerHand.hasBlackjack() && this.spotManager.getTakenUnpaidSpots().length > 0) {
      this.dealerHand.playHand();
    } 
  }

  payPlayersBlackjacks(): void {
    this.spotManager.payBlackjacks();
  };

  dealerHasBlackjack(): boolean {
    return this.dealerHand.hasBlackjack();
  }

  getDealerUpCard(): string {
    return this.dealerHand.cards[0].cardValue.toString();
  }

  getDealerHandValue(): number {
    return this.dealerHand.getValue();
  }

  getDidDealerBust(): boolean  {
    return this.dealerHand.isBust();
  }
}