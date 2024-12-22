import { LocalStorageService } from "../services/local-storage.service";
import { LocalStorageItemsEnum, TrueCountTypeEnum } from '../models-constants-enums/enumerations';
import { ShoeConditions } from "../models-constants-enums/models";
import { Card } from "./card";
import { CountingMethod } from '../models-constants-enums/models';

export class Shoe {

  private suites: string[] = ['S', 'H', 'C', 'D'];
  cards: Card[] = [];
  public runningCounts: {} = {};
  private startingCounts: {} = {};
  private discardTray: Card[] = [];
  private shoeCount: number = 0;
  private isFreshShoe: boolean = true;
  private handsCount: number = 1;
  decksPerShoe: number;
  private cardsBurned: number;
  private shufflePoint: number;
  private countBurnCard: boolean;
  private cardsPerDeck: number = 52;
  private suitsPerDeck: number = 4;
  private cardsPerSuit: number = 13;
  private countMethodNames: string[] = [];
  private trueCountTypeMethodMap;
  
  constructor(
    private conditions: ShoeConditions,
    private localStorage: LocalStorageService,
  ) {
    this.initializeShoe(); 
    this.trueCountTypeMethodMap = {
      [TrueCountTypeEnum.FULL_FLOOR]: this.getTrueCountsFloorByMethodName,
      [TrueCountTypeEnum.FULL_ROUNDED]: this.getTrueCountRoundByMethodName,
      [TrueCountTypeEnum.HALF_FLOOR]: this.getTrueCountHalfFloorByMethodName,
      [TrueCountTypeEnum.HALF_ROUNDED]: this.getTrueCountHalfRoundByMethodName,
    };
  }

  addCountingMethod(method: CountingMethod): void {
    this.runningCounts[method.title] = method.startingCount;
    this.startingCounts[method.title] = method.startingCount;
    if(!this.countMethodNames.includes(method.title)) {
      this.countMethodNames.push(method.title);
    }
    this.cards.forEach(c => c.addToCountValueMethodsMap(method));
    this.discardTray.forEach(c => c.addToCountValueMethodsMap(method));
  }

  initializeShoe(): void {
    this.decksPerShoe = this.conditions.decksPerShoe;
    this.cardsBurned = this.conditions.cardsBurned;
    this.shufflePoint = this.conditions.shufflePoint / 100;
    this.countBurnCard = this.conditions.countBurnCard;
    this.createShoe();
  }

  createShoe(): void {
    // FIRST CHECK LOCAL STORAGE FOR A SHOE THERE
    if(this.localStorage.getItem(LocalStorageItemsEnum.SHOES) 
      && this.localStorage.getItem(LocalStorageItemsEnum.SHOES)[`${this.decksPerShoe}-deck`]) {
      let shoe = [];
      let cards: string[] = this.localStorage.getItem(LocalStorageItemsEnum.SHOES)[`${this.decksPerShoe}-deck`].split(',');
      cards.forEach(card => shoe.push(new Card(card[1], this.getCardNumber(card[0]))));
      this.discardTray = [...shoe];
    } else {
    // CREATE SHOE IF NOT IN LOCAL STORAGE
      let shoe = [...this.createDeck()];
      for (let d = 0; d < this.decksPerShoe - 1; d++) {
        shoe = [...shoe, ...this.createDeck(false)];
      }
      this.discardTray = [...shoe];
    }
    this.shuffleCheck();
  }

  createDeck(incShoeCount: boolean = true): Card[] {
    const deck: Card[] = [];
    for(let s = 0; s < this.suitsPerDeck; s++) {
      for(let c = 0; c < this.cardsPerSuit; c++) {
        deck.push(new Card(this.suites[s], c));
      }
    }
    return this.shuffle(deck, this.cardsPerDeck, incShoeCount);
  }

  getCardNumber(val: string): number {
    switch(val) { 
      case 'A': { 
        return 0; 
      } 
      case 'T': { 
        return 9; 
      }
      case 'J': { 
        return 10; 
      } 
      case 'Q': { 
        return 11; 
      }
      case 'K': { 
        return 12; 
      }
      default: { 
        return parseInt(val) - 1; 
      }
    }
  }

  shuffleCheck(): void {
    const fullShoeLength: number = this.cardsPerDeck * this.decksPerShoe;
    const isShuffleTime: boolean = (this.discardTray.length / fullShoeLength) >= this.shufflePoint;
    if(isShuffleTime) {
      this.cards = this.shuffle([...this.cards, ...this.discardTray]);
      this.updateLocalStorageShoe();
      this.discardTray = [];
      this.isFreshShoe = true;
      this.handsCount = 1;
      this.burn();
    } else {
      this.isFreshShoe = false;
    }
  }

  // This shuffle algorithm is purely random and not likely an ordering that would be created from a natural shuffle, but that won't change the game or win rate at all
  // Since the same deck is reused from session to session via local storage, the shuffle is even less important
  shuffle(shoe: Card[], limit: number = this.cardsPerDeck * this.decksPerShoe, incShoeCount: boolean = true): Card[] {
    const newShoe= [];
    let oldShoe = [ ...shoe ];
    const mikeRandom = (new Date().getMilliseconds()); // The random number generator will not depend solely on the built in seed
    for (let i = limit - 1; i >= 0; i--) {
      const index = Math.ceil(Math.random() * mikeRandom) % (oldShoe.length);
      newShoe.push(oldShoe[index]);
      oldShoe = [...oldShoe.slice(0, index), ...oldShoe.slice(index + 1)];
    }
    this.countMethodNames.forEach(name => this.runningCounts[name] = this.startingCounts[name]);
    if(incShoeCount) {
      this.shoeCount += 1;
    }
    return newShoe;
  }

  updateLocalStorageShoe = (): void => {
    const minifiedShoe: string = this.cards.map(({ name }) => name).join(',');
    let shoes: any = this.localStorage.getItem(LocalStorageItemsEnum.SHOES)
      ? JSON.stringify(this.localStorage.getItem(LocalStorageItemsEnum.SHOES))
      : JSON.stringify({ });
    shoes = JSON.parse(shoes);
    shoes[`${this.decksPerShoe}-deck`] = minifiedShoe;
    this.localStorage.setItem(LocalStorageItemsEnum.SHOES, shoes);
  };

  burn(): void {
    let burnCards: Card[] = [];
    for(let i = 0; i < this.cardsBurned; i++) {
      burnCards.push(this.cards.pop());
      if(this.countBurnCard) {
        this.setRunningCounts(burnCards[i]);
      }
    }
    this.discard(burnCards);
  }

  discard(discards: Card[]): void {
    this.discardTray = [ ...this.discardTray, ...discards];
  }

  isShuffleTime(): boolean {
    const fullShoeLength: number = this.cardsPerDeck * this.decksPerShoe;
    return (this.discardTray.length / fullShoeLength) >= this.shufflePoint;
  }

  deal(): Card {
    const card: Card = this.cards.pop();
    this.setRunningCounts(card);
    return card;
  };

  dealHoleCard(): Card {
    // This card does not update the running count
    const card: Card = this.cards.pop();
    card.isHoleCard = true;
    return card;
  }

  flipHoleCard(card: Card): void {
    card.isHoleCard = false;
    this.setRunningCounts(card);
  }

  setRunningCounts = (card: Card): void => {
    this.countMethodNames
      .forEach(name => this.runningCounts[name] += card.countValuesByMethodType[name]);
  }

  // This is the uncounted decks remaining
  getDecksRemaining = (): number => {
    return (this.cards.length + this.cardsBurned - (this.conditions.countBurnCard ? 1 : 0)) / this.cardsPerDeck;
  }

  getRunningCountsByMethodName = (methodName: string): number => this.runningCounts[methodName];

  getRunningCounts = () => this.runningCounts;

  getTrueCountsFloorByMethodName = (methodTitle: string): number => {
    return (Math.round(this.getRunningCountsByMethodName(methodTitle) * 10) / (10 * this.getDecksRemaining())) < 0
      ? Math.ceil((Math.round(this.getRunningCountsByMethodName(methodTitle) * 10) / (10 * this.getDecksRemaining())))
      : Math.floor((Math.round(this.getRunningCountsByMethodName(methodTitle) * 10) / (10 * this.getDecksRemaining())));
  }
    
  getTrueCountRoundByMethodName = (methodTitle: string): number => {
    return Math.round((this.getRunningCountsByMethodName(methodTitle) * 10) / (10 * this.getDecksRemaining()));
  }

  getTrueCountHalfFloorByMethodName = (methodTitle: string): number => {
    let whole = 
      Math.round((this.getRunningCountsByMethodName(methodTitle) * 100) / this.getDecksRemaining()) / 100;
    const isNegative = whole < 0;
    if(isNegative) {
      whole = whole * -1;
    }
    const decimalPart = whole % 1;
    const intPart = whole - decimalPart;
    const roundedDecimal = decimalPart >= .5
      ? .5
      : 0
    return isNegative ? (-1) * (intPart + roundedDecimal) : intPart + roundedDecimal
  } 

  getTrueCountHalfRoundByMethodName = (methodTitle: string): number => {
    let whole = Math.round((this.getRunningCountsByMethodName(methodTitle) * 100) / this.getDecksRemaining()) / 100;
    const isNegative = whole < 0;
    if(isNegative) {
      whole = whole * -1;
    }
    const decimalPart = whole % 1;
    const intPart = whole - decimalPart;
    const roundedDecimal = decimalPart >= .75 
      ? 1 
      : decimalPart >= .25 ? .5 : 0
    return isNegative ? (-1) * (intPart + roundedDecimal) : intPart + roundedDecimal
  }

  getTrueCount(method: CountingMethod, trueCountType: TrueCountTypeEnum): number {
    if(method.convertsToTC) {
      return this.getDecksRemaining() === 0
        ? 0
        : this.trueCountTypeMethodMap[trueCountType](method.title);
    }
    return this.runningCounts[method.title];
  }

  getTrueCountByTenth(method: CountingMethod, trueCountType: TrueCountTypeEnum): number {
    return Math.round((this.runningCounts[method.title] * 10) / this.getDecksRemaining()) / 10;
  }

  getShoeCount = (): number => this.shoeCount;

  getIsFreshShoe = (): boolean => this.isFreshShoe;

  getHandsCount = (): number => this.handsCount;

  incHandCount = (): void => {
    this.handsCount += 1;
  }

  getHandId = (): string => `${this.shoeCount}-${this.handsCount}`;

  getCardsDealt(): number {
    return this.discardTray.length;
  }
}

