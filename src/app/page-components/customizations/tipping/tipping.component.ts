import { Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ViewModelService } from '../../../services/view-model.service';
import { StrategySelectorComponent } from '../../../shared-components/strategy-selector/strategy-selector.component';
import { LocalStorageItemsEnum } from '../../../models-constants-enums/enumerations';
import { TippingPlan } from '../../../models-constants-enums/models';
import { neverTips, defaultTippingPlans } from '../../../default-configs/tipping-plan';

@Component({
  selector: 'tipping',
  standalone: true,
  imports: [ CommonModule, FormsModule, RouterLink, StrategySelectorComponent ],
  templateUrl: './tipping.component.html',
  styleUrl: './tipping.component.scss'
})

export class TippingComponent implements OnInit, OnDestroy {
  
  activeStrategy: TippingPlan;
  activeStrategy$: BehaviorSubject<TippingPlan> = new BehaviorSubject<TippingPlan>(neverTips);
  localStorageItemsEnum = LocalStorageItemsEnum;
  title: string = "Add, Edit or Delete a Tipping Plan";
  defaultStrategy: TippingPlan = { ...neverTips };
  defaultStrategiesObj = {  ...defaultTippingPlans };
  howOftenTippingBooleanKeys: string[] = ['afterBlackjack', 'dealerJoins', 'dealerLeaves', 'tipFirstHandOfShoe', 'playerIncreasesBet'];
  howOftenTippingNumberKeys: string[] = ['everyXHands'];
  wongSplitDoubleTippingKeys: string[] = ['tipSplitHandToo', 'doubleDownTip', 'doubleUpTip', 'tipWongHands', 'insureTip'];

  keyDescriptionMap = {
    "afterBlackjack": "After a blackjack",
    "dealerJoins": "When a new dealer joins the table",
    "dealerLeaves": "When a dealer leaves the table",
    "tipFirstHandOfShoe": "The first hand of the shoe",
    "playerIncreasesBet": "When the player increases the bet",
    "everyXHands": ["every", "hands"],
    "tipSplitHandToo": "Add a tip when splitting a hand with a tip",
    "doubleDownTip": "Double the tip when doubling down",
    "doubleUpTip": "Double the tip when doubling up",
    "tipWongHands": "Tip wonged hands",
    "insureTip": "Insure Dealer's Tip",
  };
  private destroy$: Subject<boolean> = new Subject();

  constructor(public vmService: ViewModelService) {}

  ngOnInit(): void {
    this.vmService.showHeader$.next(true);
    this.activeStrategy$.pipe(takeUntil(this.destroy$)).subscribe(strategy => this.activeStrategy = strategy);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  addTippingPoint(): void {
    const { tipToBetsizeRatios } = this.activeStrategy;
    const newBreakpoint = tipToBetsizeRatios.length > 0 
      ? [
          tipToBetsizeRatios[tipToBetsizeRatios.length - 1][0] + 1,
          tipToBetsizeRatios[tipToBetsizeRatios.length - 1][1] + 1,
        ]
      : [1, 1]
    this.activeStrategy.tipToBetsizeRatios.push(newBreakpoint);
  }

  deleteTippingPoint(): void {
    this.activeStrategy.tipToBetsizeRatios.pop();
  }
}