import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AccordionComponent } from '../../../shared-components/accordion/accordion.component';
import { LoaderComponent } from '../../../shared-components/loader/loader.component';
import { DeviationEngine } from '../../../deviation-engine/deviation-engine';
import { LocalStorageService } from '../../../services/local-storage.service';
import { LocalStorageItemsEnum } from '../../../models-constants-enums/enumerations';
import { DeviationTableConditions } from '../../../deviation-engine/deviation-results/deviation-models';
import { playerFirst2, dealerUpCards } from '../../../deviation-engine/deviation-results/deviation-models';
import { ViewModelService } from '../../../services/view-model.service';
  
@Component({
  selector: 'edit-data',
  standalone: true,
  imports: [ AccordionComponent, CommonModule, FormsModule, LoaderComponent, RouterLink ],
  templateUrl: './edit-data.component.html',
  styleUrl: './edit-data.component.scss',
})

export class EditDataComponent implements OnInit {

  simData: any;
  simScenarios = []
  simScenarioNames: string[] = [];
  scenarioKeys: string[] = [
    'countingSystem',
    'playStrategy',
    'roundingMethod',
    'canDoubleOn',
    'S17',
    'RSA',
    'DSA',
    'DAS',
    'doubleUpLosesOnPush',
    'doubleUpLosesOnHalt',
    'lateSurrender',
  ];
  chartKeys: string[] = [];
  playerFirst2Combo: string[] = playerFirst2;
  expanded: boolean[] = [];
  disabled: boolean[] = [];
  selectedEditCards: string = '';

  constructor(
    public vmService: ViewModelService,
    public engine: DeviationEngine, 
    private localStorageService: LocalStorageService,
  ) {}

  ngOnInit(): void {
    this.vmService.showHeader$.next(true);
    this.simData = this.localStorageService.getItem(LocalStorageItemsEnum.DEVIATION_CHART);
    this.simScenarioNames = Object.keys(this.simData);
    this.simScenarios = this.simScenarioNames.map((data, i) => {
      this.disabled[i] = true;
      let properties = data.split('_');
      let obj = {
        countingSystem: properties.shift(),
        playStrategy: properties.shift(),
        roundingMethod: properties.shift(),
        canDoubleOn: properties.shift(),
        S17: properties.includes('S17'),
        RSA: properties.includes('RSA'),
        DSA: properties.includes('DSA'),
        DAS: properties.includes('DAS'),
        doubleUpLosesOnPush: properties.includes('doubleUpLosesOnPush'),
        doubleUpLosesOnHalt: properties.includes('doubleUpLosesOnHalt'),
        lateSurrender: properties.includes('lateSurrender'),
      }
      return this.scenarioKeys.map(key => `${key}: ${obj[key]}`).join(', ')
    })
  }

  edit(index: number) {
    this.simScenarios.forEach((scenario, i) => this.expanded[i] = (i === index));
  }

  clearChartKeys(index: number) {
    if(Object.keys(this.simData[this.simScenarioNames[index]].comboKeys)) {
      const comboKeys = this.simData[this.simScenarioNames[index]].comboKeys;
      dealerUpCards.map(c => c === 'T' ? 10 : c).forEach(c => {
        const chartKey = `${c}-${this.selectedEditCards}`;
        if(comboKeys[chartKey]) {
          const countKeys = Object.keys(comboKeys[chartKey]);
          const actionKeys = Object.keys(comboKeys[chartKey][countKeys[0]]);
          countKeys.forEach(countKey => actionKeys.forEach(actionKey => {
            this.simData[this.simScenarioNames[index]].comboKeys[chartKey][countKey][actionKey] = {
              instances: 0,
              amountBet: 0,
              amountWon: 0,
            }
          }))
        }
      })
    }
    this.expanded[index] = false;
    this.localStorageService.setItem(LocalStorageItemsEnum.DEVIATION_CHART, this.simData);
  }

  updatePlayersCards({ target }, index: number): void {
    if(target.value) {
      this.simScenarios.forEach((scenario, i) => this.disabled[i] = (i !== index));
      this.selectedEditCards = target.value;
    }
  }

  cancel(index: number): void {
    this.expanded[index] = false;
    this.disabled[index] = true;
  }
}