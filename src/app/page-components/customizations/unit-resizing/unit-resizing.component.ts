import { Component, OnDestroy, OnInit} from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ViewModelService } from '../../../services/view-model.service';
import { StrategySelectorComponent } from '../../../shared-components/strategy-selector/strategy-selector.component';
import { ChipTypeEnum, LocalStorageItemsEnum, RoundingMethodEnum } from '../../../models-constants-enums/enumerations';
import { UnitResizeStrategy } from '../../../models-constants-enums/models';
import { neverResize, defaultUnitResizings } from '../../../default-configs/unit-resize-strategies';

@Component({
  selector: 'unit-resizing',
  standalone: true,
  imports: [ AsyncPipe, CommonModule, FormsModule, RouterLink, StrategySelectorComponent ],
  templateUrl: './unit-resizing.component.html',
  styleUrl: './unit-resizing.component.scss'
})

export class UnitResizingComponent implements OnInit, OnDestroy {

  activeStrategy: UnitResizeStrategy = null;
  activeStrategy$: BehaviorSubject<UnitResizeStrategy> = new BehaviorSubject<UnitResizeStrategy>(neverResize);
  localStorageItemsEnum = LocalStorageItemsEnum;
  title: string = "Add, Edit or Delete a Unit Resizing Strategy";
  defaultStrategy: UnitResizeStrategy = { ...neverResize };
  defaultStrategiesObj = { ...defaultUnitResizings };
  roundingMethod = RoundingMethodEnum;
  chipTypeEnum = ChipTypeEnum;
  private destroy$: Subject<boolean> = new Subject();

  constructor(public vmService: ViewModelService) {}

  ngOnInit(): void {
    this.vmService.showHeader$.next(true);
    this.activeStrategy$.pipe(takeUntil(this.destroy$)).subscribe(s => this.activeStrategy = { ...s });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  setRoundTo(chipType: ChipTypeEnum): void {
    this.activeStrategy.roundToNearest = chipType;
  }

  setRoundingMethod(method: RoundingMethodEnum) {
    this.activeStrategy.roundingMethod = method;
  }

  addRow(): void {
    const len = this.activeStrategy.unitProgression.length - 1;
    if(len > 0) {
      const unitProgressionValue = this.activeStrategy.unitProgression[len] + 1;
      const increaseAtMultiple = this.activeStrategy.increaseAtMultiple[len - 1];
      const decreaseAtMultiple = this.activeStrategy.decreaseAtMultiple[len];
      this.activeStrategy.unitProgression.push(unitProgressionValue);
      this.activeStrategy.increaseAtMultiple.push(null);
      this.activeStrategy.increaseAtMultiple[len] = increaseAtMultiple;
      this.activeStrategy.decreaseAtMultiple.push(decreaseAtMultiple || increaseAtMultiple);
    } else {
      this.activeStrategy.unitProgression.push(1);
      this.activeStrategy.increaseAtMultiple.push(null);
      this.activeStrategy.decreaseAtMultiple.push(this.activeStrategy.increaseAtMultiple[0]);
    }
  }

  deleteRow(): void {
    const len = this.activeStrategy.unitProgression.length - 1;
    if(len > 0) {
      this.activeStrategy.unitProgression.pop();
      this.activeStrategy.increaseAtMultiple.pop();
      this.activeStrategy.decreaseAtMultiple.pop(); 
    }
  }
}