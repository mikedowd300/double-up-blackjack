import { AfterViewInit, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ViewModelService } from '../../../services/view-model.service';
import { 
  dealerUpCards,
  DeviationTableConditions, 
  InitialDeviationTableConditions, 
  playerFirst2 
} from '../../../deviation-engine/deviation-results/deviation-models';
import { countTitles, defaultCounts } from '../../../default-configs/counting-methods';
import { 
  DoubleDownOnEnum, 
  LocalStorageItemsEnum, 
  RoundingMethodEnum 
} from '../../../models-constants-enums/enumerations';
import { LocalStorageService } from '../../../services/local-storage.service';
import { CountingMethod } from '../../../models-constants-enums/models';
import { DeviationEngine } from '../../../deviation-engine/deviation-engine';
import { Chart, ChartItem, registerables } from 'chart.js';

@Component({
  selector: 'visualize-data',
  standalone: true,
  imports: [ CommonModule, RouterLink ],
  templateUrl: './visualize-data.component.html',
  styleUrl: './visualize-data.component.scss',
})

export class VisualizeDataComponent implements AfterViewInit, OnInit {
  deviationTableConditions: DeviationTableConditions = InitialDeviationTableConditions;
  doubleDownOnVals: DoubleDownOnEnum[] = [ 
    DoubleDownOnEnum.DA2,
    DoubleDownOnEnum.DT11,
    DoubleDownOnEnum.D911,
    DoubleDownOnEnum.D811,
  ];
  playerFirst2Combo: string[] = playerFirst2;
  playersCards: string = 'AA';
  countStrategy: CountingMethod;
  countingMethodTitles: string[] = [ ...countTitles ];
  selectedCountingMethodTitle: string = countTitles[0];
  playStrategyTitles: string[];
  selectedPlayStrategyTitle: string;
  roundingMethod: RoundingMethodEnum;
  chartDataExists: boolean = false;
  storedCountingMethods
  allDeviationData
  currentDeviationData
  playersCardsBasedDeviationData
  colorActionMap = {
    'stay': '#a83252',
    'hit': '#B39CD0',
    'double': '#00C9A7',
    'doubleup': '#845EC2',
    'split': '#222222',
    'surrender': '#A1A1A1',
  };
  chartIds: string[] = [ ...dealerUpCards ].map(c => c === 'T' ? '10' : c);
  charts: Chart [] = [];
  playerHandles: string[] = [];

  constructor(
    public vmService: ViewModelService,
    public engine: DeviationEngine, 
    private localStorageService: LocalStorageService,
  ) {}

  ngOnInit(): void {
    this.allDeviationData = this.localStorageService.getItem(LocalStorageItemsEnum.DEVIATION_CHART);
    this.vmService.showHeader$.next(true);
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
    }[this.selectedCountingMethodTitle].roundingMethod;
    Chart.register(...registerables);
  }
  
  ngAfterViewInit(): void {
    // this.getCurrentDeviationData();
  }

  setDeviationTableCondition({ target }, key: string) {
    this.deviationTableConditions[key].value = key === 'canDoubleOn' 
      ? target.value 
      : !this.deviationTableConditions[key].value;
    this.getCurrentDeviationData();
  }

  selectPlayersCards({ target }) {

    this.chartIds.forEach(id => {
      if(Chart.getChart(id)) {
        Chart.getChart(id).destroy();
      }
    });
    this.playersCards = target.value;
    this.getCurrentDeviationData();
  }
  
  selectCountingMethodTitle({ target }) {
    this.selectedCountingMethodTitle = target.value;
    this.getCurrentDeviationData();
  }
  
  selectPlayStrategyTitle({ target }) {
    this.selectedPlayStrategyTitle = target.value;
    this.getCurrentDeviationData();
  }

  getCurrentDeviationData() {
    const booleanConditions : string[] = [
      'DAS', 'DSA', 'RSA', 'S17', 'doubleUpLosesOnHalt', 'doubleUpLosesOnPush', 'lateSurrender',
    ];
    let key: string = `${this.selectedCountingMethodTitle.replaceAll(' ', '-')}_${this.selectedPlayStrategyTitle.replaceAll(' ', '-')}_${this.roundingMethod.replaceAll(' ', '-')}_${this.deviationTableConditions.canDoubleOn.value.toString().replaceAll(' ', '-')}`;
    booleanConditions
      .filter(c => this.deviationTableConditions[c].value)
      .forEach(c => key += `_${c}`);
    this.currentDeviationData = this.allDeviationData[key] || {};
    this.chartDataExists = !!this.allDeviationData[key];
    this.playersCardsBasedDeviationData = this.getPlayersCardsBasedDeviationData();
    if(Object.keys(this.playersCardsBasedDeviationData).length > 0) {
      this.playerHandles = this.getPlayerHandles();
      this.createCharts();
    }
    if(this.chartDataExists) {
      window.scrollTo({ top: 500, left: 0,  behavior: 'smooth' });
    }
  }

  getPlayerHandles(): string[] {
    const firstChartKey = Object.keys(this.playersCardsBasedDeviationData)[0];
    const firstCountKey = Object.keys(this.playersCardsBasedDeviationData[firstChartKey])[0];
    return Object.keys(this.playersCardsBasedDeviationData[firstChartKey][firstCountKey]);
  }

  getPlayersCardsBasedDeviationData() {
    let obj = {};
    if(this.currentDeviationData.comboKeys) {
      const chartKeys = Object.keys(this.currentDeviationData.comboKeys)
        .filter(key => key.split('-')[1] === this.playersCards.toString())
        .forEach(key => obj[key] = { ...this.currentDeviationData.comboKeys[key] });
    }
    return obj
  }

  createCharts() {
    const chartKeys = Object.keys(this.playersCardsBasedDeviationData);
    chartKeys.forEach((key, i) => {
      this.charts.push(
        this.createChart(this.chartIds[i], this.shapeResultsByInstance(this.playersCardsBasedDeviationData[key]))
      )
    });
  }

  shapeResultsByInstance(data) {
    const actionKeys = this.getActionKeys();
    let obj = {};
    Object.keys(data).forEach(key => obj[key] = {});
    Object.keys(obj).forEach(key => actionKeys.forEach(action => {
      obj[key][action]= { 
        instances: data[key][action].instances, 
        wonPerInstance: Math.round((data[key][action].amountWon * 100) / data[key][action].instances) / 100,
      }
    }))
    return obj;
  }

  getActionKeys(): string[] {
    const key = Object.keys(this.playersCardsBasedDeviationData)[0];
    return !key ? [] : Object.keys(this.playersCardsBasedDeviationData[key][0]);
  }

  makeLabels(countKeys: string[], chartData): string[] {
    return countKeys
      .map(c => parseFloat(c))
      .filter(c => c < 11 && c > -11)
      .sort((a, b) => a - b)
      .map(c => `${c} : ${this.getInstanceSums(chartData, c)}`)
  }

  getInstanceSums(data, c) {
    let sum = 0;
    Object.keys(data[c]).forEach(key => sum += data[c][key].instances);
    return sum;
  }

  sortFilterCountKeys(countKeys: string[]): string[] {
    return countKeys
      .map(c => parseFloat(c))
      .filter(c => c < 11 && c > -11)
      .sort((a, b) => a - b)
      .map(c => c.toString())
  }

  getResults(action: string, data, keys: string[]): number[] {
    let results = [];
    keys.forEach(key => results.push(data[key][action].wonPerInstance));
    return results
  }

  updateChartRange({ target }, chartId): void {
    Chart.getChart(chartId).destroy();
    const chartIdIndex = this.chartIds.indexOf(chartId);
    const chartKey = Object.keys(this.playersCardsBasedDeviationData)[chartIdIndex];
    const chartData = this.shapeResultsByInstance(this.playersCardsBasedDeviationData[chartKey]);
    const min = target.value > 0 ? 0 : parseInt(target.value);
    const max = target.value <= 0 ? 0 : parseInt(target.value);
    const options = {
      scales: {
        y: { min, max },
      }
    }
    this.createChart(chartId, chartData, options )
  }

  createChart(chartId: string, chartData, options = {}): Chart {
    const ctx = document.getElementById(chartId);
    const sortedFilteredCountKeys: string[] = this.sortFilterCountKeys(Object.keys(chartData));
    const labels = this.makeLabels(sortedFilteredCountKeys, chartData);
    return new Chart(ctx as ChartItem, {
      data: {
        labels: labels,
        datasets: this.playerHandles.map(handle => ({
          type: 'bar',
          label: handle,
          data: this.getResults(handle, chartData, sortedFilteredCountKeys),
          backgroundColor: this.colorActionMap[handle],
        })),
      }, 
      options,
    });
  }
}