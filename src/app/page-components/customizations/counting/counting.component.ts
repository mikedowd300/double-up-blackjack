import { Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ViewModelService } from '../../../services/view-model.service';
import { StrategySelectorComponent } from '../../../shared-components/strategy-selector/strategy-selector.component';
import { LocalStorageItemsEnum, RoundingMethodEnum } from '../../../models-constants-enums/enumerations';
import { CountingMethod } from '../../../models-constants-enums/models';
import { hiLo, defaultCounts } from '../../../default-configs/counting-methods';

@Component({
  selector: 'counting',
  standalone: true,
  imports: [ CommonModule, FormsModule, RouterLink, StrategySelectorComponent ],
  templateUrl: './counting.component.html',
  styleUrl: './counting.component.scss'
})

export class CountingComponent implements OnDestroy, OnInit {
  activeStrategy: CountingMethod;
  activeStrategy$: BehaviorSubject<CountingMethod> = new BehaviorSubject<CountingMethod>(hiLo);
  localStorageItemsEnum = LocalStorageItemsEnum;
  title: string = "Add, Edit or Delete a Counting Strategy";
  defaultStrategy: CountingMethod = { ...hiLo };
  defaultStrategiesObj = {  ...defaultCounts };
  firstCards: string[] = [];
  middleCards: string[] = [];
  lastCards: string[] = [];
  // selectedRoundingMethod: RoundingMethodEnum = RoundingMethodEnum.OFF;
  roundingMethods: RoundingMethodEnum[] = [RoundingMethodEnum.OFF, RoundingMethodEnum.UP];
  useHalfCount: false;
  private destroy$: Subject<boolean> = new Subject();

  constructor(public vmService: ViewModelService) {}

  ngOnInit(): void {
    this.vmService.showHeader$.next(true);
    this.activeStrategy$.pipe(takeUntil(this.destroy$)).subscribe(strategy => {
      this.activeStrategy = strategy;
      this.firstCards = ['A', '2', '3', '4'];
      this.middleCards = ['5', '6', '7', '8'];
      this.lastCards = ['9', 'T', 'J', 'Q', 'K'];
    });
  }

  updateRoundingMethod(method: RoundingMethodEnum) {
    this.activeStrategy.roundingMethod = method;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}