import { Injectable } from '@angular/core';
import { DeviationTable } from './deviation-table';
import { DeviationInfo, PlayActionsEnum } from './deviation-results/deviation-models';
import { BehaviorSubject } from 'rxjs';
import { DeviationResults } from './deviation-results/deviation-results';
import { DeviationChartService } from '../services/deviation-chart.service';
import { LocalStorageService } from '../services/local-storage.service';
import { ViewModelService } from '../services/view-model.service';

@Injectable({
  providedIn: 'root',
})

export class DeviationEngine {
  showDeviationResultsSpinner$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showDeviationResults$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  table: DeviationTable;
  shared: any = {};
  deviationResults: DeviationResults;
  deviationData$: BehaviorSubject<DeviationResults> = new BehaviorSubject<DeviationResults>(null);

  masterChartKey: string;
  
  constructor(
    public localStorageService: LocalStorageService,
    public deviationChartService: DeviationChartService,
    public vwService: ViewModelService
  ) {}

  createTable(deviationInfo: DeviationInfo) {
    this.deviationResults = new DeviationResults(deviationInfo.handStage, deviationInfo.playerCards);
    this.shared = {
      hideDeviationResultsSpinner: () => this.showDeviationResultsSpinner$.next(false),
      showDeviationResults: () => this.showDeviationResults$.next(true),
      updateResultsAmountWon: (v: number, w: string, x: PlayActionsEnum, y: string, z: boolean) => 
        this.deviationResults.updateResultsAmountWon(v, w, x, y, z),
    },

    this.table = new DeviationTable(deviationInfo, this.localStorageService, this.shared);

    this.deviationChartService.aggregateDeviationResults(deviationInfo, this.deviationResults);
  }

  hasDeviationKey(key: string): boolean {
    return !!this.deviationResults.results[key];
  }
}