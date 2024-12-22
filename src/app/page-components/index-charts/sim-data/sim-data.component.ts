import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ViewModelService } from '../../../services/view-model.service';
import { LoaderComponent } from '../../../shared-components/loader/loader.component';
import { DeviationEngine } from '../../../deviation-engine/deviation-engine';
import {
  CondensedDeviationTableCondition,
  DeviationInfo,
  DeviationTableConditions, 
  HandStageEnum, 
  InitialDeviationTableConditions, 
  LegalActionsMap, 
  playerFirst2 
} from '../../../deviation-engine/deviation-results/deviation-models';
import { DoubleDownOnEnum, LocalStorageItemsEnum, RoundingMethodEnum } from '../../../models-constants-enums/enumerations';
import { countTitles, defaultCounts } from '../../../default-configs/counting-methods';
import { LocalStorageService } from '../../../services/local-storage.service';
import { CountingMethod } from '../../../models-constants-enums/models';

@Component({
  selector: 'sim-data',
  standalone: true,
  imports: [ CommonModule, FormsModule, LoaderComponent, RouterLink ],
  templateUrl: './sim-data.component.html',
  styleUrl: './sim-data.component.scss',
})

export class SimDataComponent implements OnInit {
  actionsToTest: string[] = [];
  handStage: HandStageEnum = HandStageEnum.FIRST_2_CARDS;
  handStageEnumKeys: string[] = Object.keys(HandStageEnum);
  deviationTableConditions: DeviationTableConditions = InitialDeviationTableConditions;
  handStages: HandStageEnum[] = this.handStageEnumKeys.map(key => HandStageEnum[key]);
  doubleDownOnVals: DoubleDownOnEnum[] = [ 
    DoubleDownOnEnum.DA2,
    DoubleDownOnEnum.DT11,
    DoubleDownOnEnum.D911,
    DoubleDownOnEnum.D811,
  ];
  instances: number = 1000000;
  playersCards: string = 'AA';
  playerFirst2Combo: string[] = playerFirst2;
  countStrategy: CountingMethod;
  countingMethodTitles: string[] = [ ...countTitles ];
  selectedCountingMethodTitle: string = countTitles[0];
  playStrategyTitles: string[];
  selectedPlayStrategyTitle: string;
  roundingMethod: RoundingMethodEnum;
  storedCountingMethods

  constructor(
    public vmService: ViewModelService,
    public engine: DeviationEngine, 
    private localStorageService: LocalStorageService,
  ) {}

  ngOnInit(): void {
    this.vmService.showHeader$.next(true);
    this.actionsToTest = LegalActionsMap[this.handStage].filter(a => a !== 'Split');
    this.storedCountingMethods = this.localStorageService.getItem(LocalStorageItemsEnum.COUNT);
    const storedCountingMethodTitles = Object.keys(this.storedCountingMethods);
    const storedPlayStrategies = this.localStorageService.getItem(LocalStorageItemsEnum.PLAY);
    this.playStrategyTitles = Object.keys(storedPlayStrategies);
    this.countingMethodTitles = [ ...this.countingMethodTitles, ...storedCountingMethodTitles ];
    this.selectedCountingMethodTitle = this.countingMethodTitles[0] || '';
    this.selectedPlayStrategyTitle = this.playStrategyTitles[0] || '';
    this.roundingMethod = { 
      ...defaultCounts, 
      ...this.storedCountingMethods 
    }[this.selectedCountingMethodTitle].roundingMethod
    this.updatePlayersCards({ target: { value: this.playersCards } })
  }

  setDeviationTableCondition({ target }, key: string) {
    this.deviationTableConditions[key].value = key === 'canDoubleOn' 
      ? target.value 
      : !this.deviationTableConditions[key].value;
  }

  updateHandStage({ target }) {
    this.handStage = target.value;
  }

  updateSelectedCountingMethodTitle({ target }) {
    this.selectedCountingMethodTitle = target.value;
    this.roundingMethod = { 
      ...defaultCounts, 
      ...this.storedCountingMethods 
    }[this.selectedCountingMethodTitle].roundingMethod
  }

  updateSelectedPlayStrategyTitle({ target }) {
    this.selectedPlayStrategyTitle = target.value;
  }

  updatePlayersCards({ target }) {
    const isSplittable = target.value.split('')[0] === target.value.split('')[1] && target.value !== '11';
    this.playersCards = target.value;
    if(isSplittable && !this.actionsToTest.includes('Split')) {
      this.actionsToTest.push('Split');
    }
    if(!isSplittable && this.actionsToTest.includes('Split')) {
      this.actionsToTest = this.actionsToTest.filter(a => a !== 'Split')
    }
  }

  findIndexPlays() {
    this.engine.showDeviationResultsSpinner$.next(true);
    const deviationInfo: DeviationInfo = { 
      variableConditions: this.condenseConditions(),
      playerCards: this.playersCards,
      actions: this.actionsToTest,
      instances: this.instances,
      handStage: this.handStage,
      roundingMethod: this.roundingMethod,
      countingMethodTitle: this.selectedCountingMethodTitle,
      playStrategyTitle: this.selectedPlayStrategyTitle,
    };
    console.log(deviationInfo);
    setTimeout(() => this.engine.createTable(deviationInfo), 200);
  }

  condenseConditions(): CondensedDeviationTableCondition {
    return {
      S17: this.deviationTableConditions.S17.value,
      RSA: this.deviationTableConditions.RSA.value,
      DSA: this.deviationTableConditions.DSA.value,
      DAS: this.deviationTableConditions.DAS.value,
      canDoubleOn: this.deviationTableConditions.canDoubleOn.value,
      doubleUpLosesOnHalt: this.deviationTableConditions.doubleUpLosesOnHalt.value,
      doubleUpLosesOnPush: this.deviationTableConditions.doubleUpLosesOnPush.value,
      lateSurrender: this.deviationTableConditions.lateSurrender.value,
    } as CondensedDeviationTableCondition;
  }

  goToPage() {
    console.log('Redirect to Page');
  }
}