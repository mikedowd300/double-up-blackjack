import { Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ViewModelService } from '../../../services/view-model.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { StrategySelectorComponent } from '../../../shared-components/strategy-selector/strategy-selector.component';
import { LocalStorageItemsEnum } from '../../../models-constants-enums/enumerations';
import { PlayerConfig } from '../../../models-constants-enums/models';
import { ploppy1, defaultPlayers } from '../../../default-configs/player-config';
import { betSpreadTitles } from '../../../default-configs/bet-spread-strategies';
import { countTitles } from '../../../default-configs/counting-methods';
import { playTitles } from '../../../default-configs/play-strategies';
import { tippingTitles } from '../../../default-configs/tipping-plan';
import { unitResizingTitles } from '../../../default-configs/unit-resize-strategies';
import { wongingTitles } from '../../../default-configs/wonging-strategies';
import { insuranceTitles } from '../../../default-configs/insurance-plan';

@Component({
  selector: 'player',
  standalone: true,
  imports: [ CommonModule, FormsModule, RouterLink, StrategySelectorComponent ],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})

export class PlayerComponent implements OnDestroy, OnInit {

  activeStrategy: PlayerConfig;
  activeStrategy$: BehaviorSubject<PlayerConfig> = new BehaviorSubject<PlayerConfig>(ploppy1);
  localStorageItemsEnum = LocalStorageItemsEnum;
  title: string = "Add, Edit or Delete a Player Configuration";
  defaultStrategy: PlayerConfig = { ...ploppy1 };
  defaultStrategiesObj = {  ...defaultPlayers };
  private destroy$: Subject<boolean> = new Subject();

  strategyLists = {
    [this.localStorageItemsEnum.PLAY]: playTitles,
    [this.localStorageItemsEnum.BET_SPREAD]: betSpreadTitles,
    [this.localStorageItemsEnum.UNIT_RESIZE]: unitResizingTitles,
    [this.localStorageItemsEnum.TIPPING]: tippingTitles,
    [this.localStorageItemsEnum.WONG]: wongingTitles,
    [this.localStorageItemsEnum.COUNT]: countTitles,
    [this.localStorageItemsEnum.INSURANCE]: insuranceTitles
  };

  selectLabels: string[] = [
    "Select a playing stratery",
    "Select a bet spreading strategy",
    "Select a unit resizing strategy",
    "Select a tipping strategy",
    "Select a wonging strategy",
    "Select a counting strategy",
    "Select an insurance plan",
  ];

  strategyTitles = [
    this.localStorageItemsEnum.PLAY,
    this.localStorageItemsEnum.BET_SPREAD,
    this.localStorageItemsEnum.UNIT_RESIZE,
    this.localStorageItemsEnum.TIPPING,
    this.localStorageItemsEnum.WONG,
    this.localStorageItemsEnum.COUNT,
    this.localStorageItemsEnum.INSURANCE,
  ];

  titlePropertyMap = {
    [this.localStorageItemsEnum.PLAY]: 'playStrategyTitle',
    [this.localStorageItemsEnum.BET_SPREAD]: 'betSpreadStrategyTitle',
    [this.localStorageItemsEnum.UNIT_RESIZE]: 'unitResizingStrategyTitle',
    [this.localStorageItemsEnum.TIPPING]: 'tippngStrategyTitle',
    [this.localStorageItemsEnum.WONG]: 'wongingStrategyTitle',
    [this.localStorageItemsEnum.COUNT]: 'countStrategyTitle',
    [this.localStorageItemsEnum.INSURANCE]: 'insurancePlanTitle',
  }

  constructor(
    public vmService: ViewModelService, 
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.vmService.showHeader$.next(true);
    this.activeStrategy$.pipe(takeUntil(this.destroy$)).subscribe(strategy => this.activeStrategy = strategy);
    this.getStrategies();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  selectStrategy({ target }, title: string) {
    this.activeStrategy[this.titlePropertyMap[title]] = target.value;
  }

  getStrategies(): void {
    Object.keys(this.strategyLists).forEach(title => {
      const stored = this.localStorageService.getItem(title) || {};
      const storedTitles = Object.keys(stored).length > 0 
        ? Object.keys(stored)
        : []
      this.strategyLists[title] = [...this.strategyLists[title], ...storedTitles];
    }) 
  }
}