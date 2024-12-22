import { Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ViewModelService } from '../../../services/view-model.service';
import { StrategySelectorComponent } from '../../../shared-components/strategy-selector/strategy-selector.component';
import { LocalStorageItemsEnum } from '../../../models-constants-enums/enumerations';
import { WongStrategy } from '../../../models-constants-enums/models';
import { neverWong, defaultWongings } from '../../../default-configs/wonging-strategies';

@Component({
  selector: 'wonging',
  standalone: true,
  imports: [ CommonModule, FormsModule, RouterLink, StrategySelectorComponent ],
  templateUrl: './wonging.component.html',
  styleUrl: './wonging.component.scss'
})

export class WongingComponent implements OnInit, OnDestroy {

  activeStrategy: WongStrategy;
  activeStrategy$: BehaviorSubject<WongStrategy> = new BehaviorSubject<WongStrategy>(neverWong);
  localStorageItemsEnum = LocalStorageItemsEnum;
  title: string = "Add, Edit or Delete a Counting Strategy";
  defaultStrategy: WongStrategy = { ...neverWong };
  defaultStrategiesObj = {  ...defaultWongings };
  private destroy$: Subject<boolean> = new Subject();

  constructor(public vmService: ViewModelService) {}

  ngOnInit(): void {
    this.vmService.showHeader$.next(true);
    this.activeStrategy$.pipe(takeUntil(this.destroy$)).subscribe(strategy => this.activeStrategy = strategy);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  addHand() {
    if(this.activeStrategy.wongedHands.length === 0) {
      this.activeStrategy.wongedHands.push({ enterAt: 0, exitBelow: 0, isActive: false });
    } else {
      const lastIndex = this.activeStrategy.wongedHands.length - 1;
      const enterAt = this.activeStrategy.wongedHands[lastIndex].enterAt;
      const exitBelow = this.activeStrategy.wongedHands[lastIndex].exitBelow;
      this.activeStrategy.wongedHands.push({ enterAt, exitBelow, isActive: false });
    }
  }

  deleteHand() {
    if(this.activeStrategy.wongedHands.length >= 0) {
      this.activeStrategy.wongedHands.pop();
    }
  }
}