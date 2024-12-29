import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ViewModelService } from '../../services/view-model.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { Conditions, PlayerConfig, SimInfo, SpotUIObj, TableConfig } from '../../models-constants-enums/models';
import { LocalStorageItemsEnum } from '../../models-constants-enums/enumerations';
import { tableTitles, defaultTables } from '../../default-configs/table-config';
import { defaultPlayers } from '../../default-configs/player-config';
import { allDefaultConditions } from '../../default-configs/conditions';

@Component({
  selector: 'simulation',
  standalone: true,
  imports: [ CommonModule, RouterLink ],
  templateUrl: './simulation.component.html',
  styleUrl: './simulation.component.scss'
})

export class SimulationPageComponent implements OnInit {

  iterationOptions: any[] = [ 1, 5, 10, 100, 1000, 10000, 50000, 100000, 1000000, 'Other' ];
  iterations: number = 1;
  
  allTableTitles: string[];
  storedTableTitles: string[];
  allTableObjects: { [k: string]: TableConfig };
  storedTableObjects: { [k: string]: TableConfig };
  
  storedPlayerObjects: { [k: string]: PlayerConfig };
  allPlayerObjects: { [k: string]: PlayerConfig };
  
  storedConditions: { [k: string]: Conditions };
  allConditionObjects: { [k: string]: Conditions };
  
  activeTable: TableConfig;
  activeConditions: Conditions;
  activePlayers: PlayerConfig[] = [];
  
  spots: any[];
  showCustomRoundsUI: boolean = false;
  showSimButton: boolean = false;

  constructor(
    public vmService: ViewModelService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.vmService.showHeader$.next(true);
    this.storedTableObjects = this.localStorageService.getItem(LocalStorageItemsEnum.TABLE_CONFIG);
    this.allTableObjects = { ...defaultTables, ...this.storedTableObjects };
    this.storedPlayerObjects = this.localStorageService.getItem(LocalStorageItemsEnum.PLAYER_CONFIG);
    this.allPlayerObjects = { ...defaultPlayers, ...this.storedPlayerObjects };
    this.storedConditions = this.localStorageService.getItem(LocalStorageItemsEnum.CONDITIONS);
    this.allConditionObjects = { ...allDefaultConditions, ...this.storedConditions };
    this.storedTableTitles = Object.keys(this.storedTableObjects || {});
    this.allTableTitles = [ ...tableTitles, ...this.storedTableTitles ];
    this.selectTable({ target: { value: tableTitles[0] }})
  }

  selectTable({ target }) {
    this.activeTable = this.allTableObjects[target.value];
    this.activeTable.players
      .forEach(p => this.activePlayers.push(this.allPlayerObjects[p.playerConfigTitle]));
    this.activeConditions = this.allConditionObjects[this.activeTable.conditionsTitle];
    this.spots = this.getSpots();
    if(this.iterations) {
      this.showSimButton = true;
    }
  }
  
  selectIteration({ target }) {
    if(parseInt(target.value)) {
      this.iterations = parseInt(target.value);
      if(this.activeTable.conditionsTitle) {
        this.showSimButton = true;
      }
    } else {
      this.showCustomRoundsUI = true;
    }
  }
  
  getSpots(): any[] {
    let spots = [];
    for(let s = 1; s <= this.activeConditions.spotsPerTable ; s++) {
      const player = this.activeTable.players.find(p => p.seatNumber === s);
      if(!!player) {
        let spotObj: SpotUIObj = {} as SpotUIObj;
        const playerObj = this.allPlayerObjects[player.playerConfigTitle]
        spotObj.title = { description: '', value: player.playerConfigTitle };
        spotObj.bankroll = { description: 'Starting Bankroll', value: playerObj.initialBankroll };
        spotObj.bettingUnit = { description: 'Initial Betting Unit', value: playerObj.initialBettingUnit };
        spotObj.playStategy = { description: 'Play Strategy', value: playerObj.playStrategyTitle };
        spotObj.spreadStrategy = { description: 'Bet Spread Strategy', value: playerObj.betSpreadStrategyTitle };
        spotObj.tippingStrategy = { description: 'Tipping Strategy', value: playerObj.tippngStrategyTitle };
        spotObj.resizeStrategy = { 
          description: 'Bet Resizing Strategy', 
          value: playerObj.unitResizingStrategyTitle 
        };
        spotObj.wongingStrategy = { description: 'Wonging Strategy', value: playerObj.wongingStrategyTitle };
        spotObj.countingStratgey = { description: 'Counting Strategy', value: playerObj.countStrategyTitle };
        spots.push(spotObj)
      } else {
        spots.push(null)
      }
    }
    return spots
  }
  
  startSim() {
    this.vmService.setSimInfo({ 
      tableSkeleton: this.activeTable, 
      iterations: this.iterations 
    } as SimInfo);
    this.router.navigate(['/dashboard']);
  }
}