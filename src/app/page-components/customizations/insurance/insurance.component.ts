import { Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ViewModelService } from '../../../services/view-model.service';
import { StrategySelectorComponent } from '../../../shared-components/strategy-selector/strategy-selector.component';
import { LocalStorageItemsEnum } from '../../../models-constants-enums/enumerations';
import { InsurancePlan } from '../../../models-constants-enums/models';
import { neverInsure, defaultInsurancePlans } from '../../../default-configs/insurance-plan';

@Component({
  selector: 'insurance',
  standalone: true,
  imports: [ CommonModule, FormsModule, RouterLink, StrategySelectorComponent ],
  templateUrl: './insurance.component.html',
  styleUrl: './insurance.component.scss'
})

export class InsuranceComponent implements OnInit, OnDestroy {

  activeStrategy: InsurancePlan;
  activeStrategy$: BehaviorSubject<InsurancePlan> = new BehaviorSubject<InsurancePlan>(neverInsure);
  localStorageItemsEnum = LocalStorageItemsEnum;
  title: string = "Add, Edit or Delete an Insurance Plan";
  defaultStrategy: InsurancePlan = { ...neverInsure };
  defaultStrategiesObj = {  ...defaultInsurancePlans };
  private destroy$: Subject<boolean> = new Subject();

  constructor(public vmService: ViewModelService) {}

  ngOnInit(): void {
    this.vmService.showHeader$.next(true);
    this.activeStrategy$.pipe(takeUntil(this.destroy$)).subscribe(strategy => this.activeStrategy = strategy);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  changePlan({ target }, insurancePlanType: string) {
    if(insurancePlanType === 'alwaysInsure') {
      this.activeStrategy.alwaysInsure = true;
      this.activeStrategy.neverInsure = false;
      this.activeStrategy.atTCof = null;
    } else if(insurancePlanType === 'neverInsure') {
      this.activeStrategy.alwaysInsure = false;
      this.activeStrategy.neverInsure = true;
      this.activeStrategy.atTCof = null;
    } else if(insurancePlanType === 'trueCount') {
      this.activeStrategy.alwaysInsure = false;
      this.activeStrategy.neverInsure = false;
      this.activeStrategy.atTCof = target.value;
    }
  }
}