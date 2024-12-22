import { Table } from './table';
import { SimInfo } from '../models-constants-enums/models';
import { LocalStorageService } from '../services/local-storage.service';
import { ViewModelService } from '../services/view-model.service';

export class DoubleUpEngine {

  table: Table;
  insuranceHistoryByPlayers: any = {};
  
  constructor(
    private localStorageService: LocalStorageService,
    public vwService: ViewModelService
  ) {}

  createTable(simInfo: SimInfo) {
    this.table = new Table(simInfo, this.localStorageService);
    this.vwService.simData$.next(this.table.history.records);
    this.table.players.forEach(p => 
      this.insuranceHistoryByPlayers[p.handle] = { ...p.insuranceHistory }
    );
    this.vwService.insuranceResults$.next(this.insuranceHistoryByPlayers);
  }
}