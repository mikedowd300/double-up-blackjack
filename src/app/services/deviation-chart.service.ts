import { Injectable } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { LocalStorageService } from '../services/local-storage.service';
import { DeviationInfo } from '../deviation-engine/deviation-results/deviation-models';
import { LocalStorageItemsEnum } from '../models-constants-enums/enumerations';
import { DeviationResults } from '../deviation-engine/deviation-results/deviation-results';

@Injectable({ providedIn: 'root' })
export class DeviationChartService {
  chart: Chart;
  activeChartDataKey: string;
  deviationData;
  roiByActionData;
  chartDataKeys: string[] = [];
  masterChartKey: string = '';

  constructor(public localStorageService: LocalStorageService) { }

  aggregateDeviationResults(info: DeviationInfo, results: DeviationResults) {
    this.masterChartKey = this. createLSMasterChartKey(info)
    const deviationResultInfoKeys: string[] = ['instances', 'amountBet', 'amountWon'];
    let key: string = this.createLSMasterChartKey(info);
    this.activeChartDataKey = key;
    let deviationChartData = this.localStorageService.getItem(LocalStorageItemsEnum.DEVIATION_CHART);
    if(!deviationChartData[this.masterChartKey]) {
      deviationChartData[this.masterChartKey] = { comboKeys: { ...results.results } }
    } else {
      const comboKeys = Object.keys(deviationChartData[this.masterChartKey].comboKeys);
      const resultsComboKeys = Object.keys(results.results);
      if(!comboKeys.includes(resultsComboKeys[0])) {
        deviationChartData[this.masterChartKey] = { 
          comboKeys: { ...deviationChartData[this.masterChartKey].comboKeys, ...results.results }
        }
      } else {
        resultsComboKeys.forEach(rcKey => {
          const countKeys = Object.keys(results.results[rcKey]);
          countKeys.forEach(cKey => {
            if(!deviationChartData[this.masterChartKey].comboKeys[rcKey][cKey]) {
              deviationChartData[this.masterChartKey].comboKeys[rcKey][cKey] = 
                { ...results.results[rcKey][cKey] };
            } else {
              const actionKeys = Object.keys(results.results[rcKey][cKey]);
              actionKeys.forEach(aKey => {
                deviationChartData[this.masterChartKey].comboKeys[rcKey][cKey][aKey].instances += results.results[rcKey][cKey][aKey].instances;
                deviationChartData[this.masterChartKey].comboKeys[rcKey][cKey][aKey].amountBet += results.results[rcKey][cKey][aKey].amountBet;
                deviationChartData[this.masterChartKey].comboKeys[rcKey][cKey][aKey].amountWon += results.results[rcKey][cKey][aKey].amountWon;
              })
            }
          })
        })
      }
    } 
    this.localStorageService.setItem(LocalStorageItemsEnum.DEVIATION_CHART, deviationChartData);
  }

  // getDeviationData() {
  //   this.deviationData = this.localStorageService.getItem(LocalStorageItemsEnum.DEVIATION_CHART);
  //   this.chartDataKeys = Object.keys(this.deviationData);
  //   console.log(this.chartDataKeys );
  //   return this.deviationData
  // }

  // setActiveChartDataKey(key: string): void {
  //   this.activeChartDataKey = key;
  // }

  // setRoiByActionData() {
  //   console.log(this.deviationData[this.activeChartDataKey]);
  // }

  createLSMasterChartKey(deviationInfo: DeviationInfo): string {
    const { countingMethodTitle, playStrategyTitle, roundingMethod, variableConditions } = deviationInfo;
    const booleanConditions : string[] = [
      'DAS', 'DSA', 'RSA', 'S17', 'doubleUpLosesOnHalt', 'doubleUpLosesOnPush', 'lateSurrender',
    ];
    // The pieces of the LS key correspond to the following map:
    // countingMethodTitle
    // playStrategyTitle
    // roundingMethod

    // The only variable condition that is not boolean values is:
    // canDoubleOn, it's value will be the 4th section

    // For the remaining variable conditions:
    // DAS, DSA, RSA, S17, doubleUpLosesOnHalt, doubleUpLosesOnPush, lateSurrender;
    // ehe existence of the condition in the key string indicates the condition is true 
    // while the abscence of the condition indicates the condition is false
    let key: string = `${countingMethodTitle.replaceAll(' ', '-')}_${playStrategyTitle.replaceAll(' ', '-')}_${roundingMethod.replaceAll(' ', '-')}_${variableConditions.canDoubleOn.replaceAll(' ', '-')}`;
    booleanConditions.filter(c => variableConditions[c]).forEach(c => key += `_${c}`);
    return key;
  }
}