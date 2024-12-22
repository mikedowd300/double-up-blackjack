import { Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ViewModelService } from '../../../services/view-model.service';
import { StrategySelectorComponent } from '../../../shared-components/strategy-selector/strategy-selector.component';
import { 
  DoubleDownOnEnum, 
  InputTypeEnum, 
  LocalStorageItemsEnum, 
  PayRatioEnum 
} from '../../../models-constants-enums/enumerations';
import { ruleDescriptionMap } from '../../../models-constants-enums/constants';
import { Conditions, RuleDescriptionMap, RuleInput } from '../../../models-constants-enums/models';
import { defaultConditions, allDefaultConditions } from '../../../default-configs/conditions';

@Component({
  selector: 'conditions',
  standalone: true,
  imports: [ CommonModule, FormsModule, RouterLink, StrategySelectorComponent],
  templateUrl: './conditions.component.html',
  styleUrl: './conditions.component.scss'
})

export class ConditionsComponent implements OnDestroy, OnInit {
  
  ruleDescriptionMap: RuleDescriptionMap = ruleDescriptionMap;
  activeStrategy: Conditions = { ...defaultConditions };
  activeStrategy$: BehaviorSubject<Conditions> = new BehaviorSubject<Conditions>(defaultConditions);
  localStorageItemsEnum = LocalStorageItemsEnum;
  title: string = "Add, Edit or Delete a set of Conditions";
  defaultStrategy: Conditions = { ...defaultConditions };
  defaultStrategiesObj = {  ...allDefaultConditions };
  inputRules: RuleInput[];
  textInputRules: RuleInput[];
  numberInputRules: RuleInput[];
  radioInputRules: RuleInput[];
  checkboxInputRules: RuleInput[];
  rangeInputRules: RuleInput[];
  payRatioEnumArray = Object.keys(PayRatioEnum).map(key => PayRatioEnum[key]);
  doubleDownOnEnumArray = Object.keys(DoubleDownOnEnum).map(key => DoubleDownOnEnum[key]);
  radioMap = {
    canDoubleOn: this.doubleDownOnEnumArray,
    payRatio: this.payRatioEnumArray,
  };
  private destroy$: Subject<boolean> = new Subject();

  constructor(public vmService: ViewModelService) {}

  ngOnInit(): void {
    this.vmService.showHeader$.next(true);

    this.inputRules = Object.keys(this.ruleDescriptionMap)
      .map(key => this.ruleDescriptionMap[key]);

    this.textInputRules = this.inputRules
      .filter(rule => rule.inputType === InputTypeEnum.TEXT);

    this.numberInputRules = this.inputRules
      .filter(rule => rule.inputType === InputTypeEnum.NUMBER);

    this.radioInputRules = this.inputRules
      .filter(rule => rule.inputType === InputTypeEnum.RADIO)
      .map(rule => ({ ...rule, radioValues: this.radioMap[rule.ruleName] }));

    this.checkboxInputRules = this.inputRules
      .filter(rule => rule.inputType === InputTypeEnum.CHECKBOX);

    this.rangeInputRules = this.inputRules
      .filter(rule => rule.inputType === InputTypeEnum.RANGE);

    this.activeStrategy$.pipe(takeUntil(this.destroy$)).subscribe(strategy => {
      this.activeStrategy = strategy;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  updateCheckboxInput(e, ruleName: string): void {
    this.activeStrategy[ruleName] = !this.activeStrategy[ruleName];
  }

  updateNumberInput({ target }, rule: RuleInput) {
    const val: number = parseInt(target.value);
    this.activeStrategy[rule.ruleName as string] = val;
    if(!!rule.min && rule.min > val) {
      this.activeStrategy[rule.ruleName as string] = rule.min;
    } 
    if (rule.max && rule.max < val) {
      this.activeStrategy[rule.ruleName as string] = rule.max;
    }
  }

  updateRangeInput({ target }, rule: RuleInput): void {
    const val: number = parseInt(target.value);
    this.activeStrategy[rule.ruleName as string] = val;
  }

  updateRadioInput(rule: RuleInput, radioValue: any): void {
    this.activeStrategy[rule.ruleName as string] = radioValue;
  }
}