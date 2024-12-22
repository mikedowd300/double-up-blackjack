import { Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ViewModelService } from '../../../services/view-model.service';
import { StrategySelectorComponent } from '../../../shared-components/strategy-selector/strategy-selector.component';
import { LocalStorageItemsEnum } from '../../../models-constants-enums/enumerations';
import { PlayStrategy } from '../../../models-constants-enums/models';
import { defaultPlay } from '../../../default-configs/play-strategies';
import { basicH17Strategy } from '../../../default-configs/play-strategies/basic-h17';

@Component({
  selector: 'play-chart',
  standalone: true,
  imports: [ CommonModule, FormsModule, RouterLink, StrategySelectorComponent ],
  templateUrl: './play-chart.component.html',
  styleUrl: './play-chart.component.scss'
})

export class PlayChartComponent implements OnDestroy, OnInit {

  activeStrategy: PlayStrategy;
  activeStrategy$: BehaviorSubject<PlayStrategy> = new BehaviorSubject<PlayStrategy>(basicH17Strategy);
  localStorageItemsEnum = LocalStorageItemsEnum;
  title: string = "Add, Edit or Delete a Play Chart";
  defaultStrategy: PlayStrategy = { ...basicH17Strategy };
  defaultStrategiesObj = {  ...defaultPlay };
  upCards: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'];
  playersCardsKey: string[] = [];
  keyColumns: string[][];
  private destroy$: Subject<boolean> = new Subject();

  constructor(public vmService: ViewModelService) {}

  ngOnInit(): void {
    this.vmService.showHeader$.next(true);
    this.activeStrategy$.pipe(takeUntil(this.destroy$)).subscribe(strategy => {
      this.activeStrategy = strategy;
      const { combos } = this.activeStrategy;
      const comboKeys = Object.keys(combos);
      this.playersCardsKey = comboKeys
        .filter(k => k.split('-').shift() === '2')
        .map(key => key.split('-').pop()); 
      this.keyColumns = this.upCards.map(c => this.playersCardsKey.map(k => `${c}-${k}`));
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}