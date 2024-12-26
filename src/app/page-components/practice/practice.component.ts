import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ViewModelService } from '../../services/view-model.service';
import { AccordionComponent } from '../../shared-components/accordion/accordion.component';
import { playTitles, defaultPlay } from '../../default-configs/play-strategies';
import { LocalStorageService } from '../../services/local-storage.service';
import { LocalStorageItemsEnum } from '../../models-constants-enums/enumerations';
import { PlayStrategy } from '../../models-constants-enums/models';
import { playerFirst2No20 } from '../../deviation-engine/deviation-results/deviation-models';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'practice',
  standalone: true,
  imports: [ AccordionComponent, CommonModule, FormsModule, RouterLink ],
  templateUrl: './practice.component.html',
  styleUrl: './practice.component.scss'
})

export class PracticeComponent implements OnInit {
  expandConditions$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  allPlayTitles: string[] = [];
  localStorageItemsEnum = LocalStorageItemsEnum;
  selectedPlayStrategyTitle: string = 'Heavy 6 H17 Basic';
  selectedPlayStrategy: PlayStrategy;
  storedPlayStrategies;
  usesSurrender: boolean = false;
  upCards: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'];
  upCardExceptions: string[] = [];
  filteredUpCards: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'];
  first2Cards: string[] = [ ...playerFirst2No20];
  first2CardsExceptions: string[] = [];
  filteredFirst2Cards: string[] = [ ...playerFirst2No20];
  exceptionRows: number[] = [];
  exceptionColumns: number[] = [];
  deviationRange: number = 0;
  playerCard1: string = '';
  playerCard2: string = '';
  dealerCard: string = '';
  showPracticeTable: boolean = false;
  canSplit: boolean = false;
  trueCount: number = 0;
  chartKey: string = null;
  hasPlayError: boolean = false;
  sign: number = 1;
  action: string = null;
  suites: string[] = ['H', 'D', 'S', 'C'];
  tens: string[] = ['0', 'J', 'Q', 'K'];
  playerHands = {
    '19': ['X,9'],
    '18': ['X,8'],
    '17': ['X,7', '9,8'],
    '16': ['X,6', '9,7'],
    '15': ['X,5', '9,6', '8,7'],
    '14': ['X,4', '9,5', '8,6'],
    '13': ['X,3', '9,4', '8,5', '7,6'],
    '12': ['X,2', '9,3', '8,4', '7,4'],
    '11': ['9,2', '8,3', '7,4', '6,5'],
    '10': ['8,2', '7,3', '6,4'],
    '9': ['7,2', '6,3', '5,4'],
    '8': ['6,2', '5,3'],
    '7': ['5,2', '4,3'],
    '6': ['4,2'],
    '5': ['3,2'],
  };

  constructor(public vmService: ViewModelService, private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.selectedPlayStrategy = defaultPlay[this.selectedPlayStrategyTitle];
    this.storedPlayStrategies = this.localStorageService.getItem(this.localStorageItemsEnum.PLAY) || {};
    const storedTitles = Object.keys(this.storedPlayStrategies).length > 0 
      ? Object.keys(this.storedPlayStrategies)
      : []
    this.vmService.showHeader$.next(true);
    this.allPlayTitles = [ ...playTitles, ...storedTitles ];
  }

  updateSelectedPlayStrategyTitle({ target }) {
    this.selectedPlayStrategyTitle = target.value;
    this.selectedPlayStrategy = { ...defaultPlay, ...this.storedPlayStrategies }[this.selectedPlayStrategyTitle];
  }

  updateFilteredUpCardExceptions(card: string, index: number) {
    if(this.upCardExceptions.includes(card)) {
      this.upCardExceptions = this.upCardExceptions.filter(c => c !== card);
      this.exceptionRows = this.exceptionRows.filter(e => e !== index);
    } else {
      this.upCardExceptions.push(card);
      this.exceptionRows.push(index);
    }
    this.filteredUpCards = this.upCards.filter(c => !this.upCardExceptions.includes(c));
  }

  updateFilteredFirst2Cards(cards: string, index: number) {
    if(this.first2CardsExceptions.includes(cards)) {
      this.first2CardsExceptions = this.first2CardsExceptions.filter(c => c !== cards);
      this.exceptionColumns = this.exceptionColumns.filter(e => e !== index);
    } else {
      this.first2CardsExceptions.push(cards);
      this.exceptionColumns.push(index);
    }
    this.filteredFirst2Cards = this.first2Cards.filter(c => !this.first2CardsExceptions.includes(c));
  }

  deal() {
    const upcardIndex = Math.floor((Math.random() * 1231) % this.filteredUpCards.length);
    const playersPairIndex = Math.floor((Math.random() * 17237) % this.filteredFirst2Cards.length);
    this.trueCount = this.sign * Math.floor((Math.random() * 1231) % (this.deviationRange + 1));
    this.sign = this.sign * (-1);
    const upCard: string = this.filteredUpCards[upcardIndex];
    const playersPair: string = this.filteredFirst2Cards[playersPairIndex];
    this.chartKey = `${upCard}-${playersPair}`;
    this.makeCards(playersPair, upCard);
    this.expandConditions$.next(false);
    this.showPracticeTable = true;
  }

  makeCards(playerValue: string, dealerValue: string): void {
    const cardPair = this.playerHands[playerValue]
      ? this.playerHands[playerValue][0]
      : playerValue.split('').join(',')
    this.canSplit = cardPair.split(',')[0] === cardPair.split(',')[1];
    let card1: string = cardPair.split(',')[0].replace('10', 'X').replace('1', 'A');
    let card2: string = cardPair.split(',')[1].replace('10', 'X').replace('1', 'A');
    let dealerCard = dealerValue.replace('10', 'X').replace('1', 'A');
    if(card1 === 'X' || card1 === 'T') {
      card1 = this.getX();
    }
    if(card2 === 'X' || card2 === 'T') {
      card2 = this.getX();
    }
    if(dealerCard === 'X' || card1 === 'T') {
      dealerCard = this.getX();
    }
    card1 += this.getSuite();
    card2 += this.getSuite();
    dealerCard += this.getSuite();
    this.playerCard1 = `https://deckofcardsapi.com/static/img/${card1}.png`;
    this.playerCard2 = `https://deckofcardsapi.com/static/img/${card2}.png`;
    this.dealerCard = `https://deckofcardsapi.com/static/img/${dealerCard}.png`;
  }

  getX(): string {
    const activeTen: string = this.tens[0];
    this.tens = this.tens.slice(1, this.tens.length)
    this.tens.push(activeTen);
    return activeTen;
  }

  getSuite(): string {
    const activeSuite: string = this.suites[0];
    this.suites = this.suites.slice(1, this.suites.length)
    this.suites.push(activeSuite);
    return activeSuite;
  }

  doAction(selectedAction: string) {
    let conditions = this.selectedPlayStrategy.combos[this.chartKey].conditions.split(' ').filter(c => c !== '');
    let actions: string[] = this.selectedPlayStrategy.combos[this.chartKey].options.split(' ');
    let action: string = null;
    while(!action && conditions.length !== 0) {
      let tempCond = parseFloat(conditions.shift());
      if((tempCond > 0 && this.trueCount >= tempCond) || (tempCond < 0 && this.trueCount <= tempCond)) {
        action = actions.shift();
      } else {
        actions.shift();
      }
    }
    action = action || actions.shift();
    this.action = action;
    if(selectedAction === action) {
      this.deal();
    } else {
      this.hasPlayError = true;
      setTimeout(() => {
        this.hasPlayError = false;
        this.deal();
      }, 5000)
    }
  }
}