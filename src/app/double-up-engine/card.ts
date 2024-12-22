import { cardValues } from '../models-constants-enums/constants';
import { CountingMethod } from '../models-constants-enums/models';

export class Card {
  cardSuitlessName: string;
  name: string;
  image: string;
  cardValue: number;
  countValuesByMethodType: { [k:string]: number } = {};
  countValuesMap = {};
  countMethodNames: string[] = [];

  constructor(suit: string, index: number, public isHoleCard: boolean = false) {
    this.name = `${cardValues[index]}${suit}`;
    this.image = `https://deckofcardsapi.com/static/img/${this.name}.png`;
    this.cardValue = Math.min(index + 1, 10);
    this.cardSuitlessName = this.name.split('')[0];
  }

  addToCountValueMethodsMap(method: CountingMethod): void {
    if(!this.countMethodNames.includes(method.title)) {
      this.countValuesByMethodType[method.title] = method.valuesMap[this.cardSuitlessName];
      this.countMethodNames.push(method.title);
    }
  }
}