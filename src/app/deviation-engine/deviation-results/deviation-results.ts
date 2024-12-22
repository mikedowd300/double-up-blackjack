import { 
  DeviationInfo,
  DeviationResult, 
  DeviationResultByAction, 
  DeviationResultsObj,
  HandStageEnum, 
  PlayActionsEnum,
  dealerUpCards
} from "./deviation-models";

export class DeviationResults {
  results: DeviationResultsObj = {};

  constructor(
    private stage: HandStageEnum, 
    public playerCards: string,
  ){
    this.createParentKeys()
  }

  createParentKeys() {
    dealerUpCards
      .map(c => c === 'T' ? 10 : c)
      .forEach(c => this.results[`${c}-${this.playerCards}`] = {});
  }

  private isSplittable(): boolean {
    return this.playerCards !== '11' && (this.playerCards.split('')[0] === this.playerCards.split('')[1]);
  }

  private getNewDeviationResultByAction(): DeviationResultByAction {
    const newResult: DeviationResult = {
      instances: 0,
      amountBet: 0,
      amountWon: 0,
    };
    let players: DeviationResultByAction = {
      [PlayActionsEnum.STAY] : { ...newResult }, 
    }
    if(this.stage === HandStageEnum.FIRST_2_CARDS) {
      players[PlayActionsEnum.HIT] = { ...newResult };
      players[PlayActionsEnum.DOUBLE] = { ...newResult };
      players[PlayActionsEnum.DOUBLE_UP] = { ...newResult };
    }
    // if(this.stage === HandStageEnum.AFTER_HITTING) {
    //   players[PlayActionsEnum.HIT] = { ...newResult };
    // }
    if(this.stage === HandStageEnum.FIRST_2_CARDS && this.isSplittable()) {
      players[PlayActionsEnum.SPLIT] = { ...newResult };
    }; 
    return players;
  }

  incResultsAmountWon(amountWon: number, chartKey: string, countKey: string, action: PlayActionsEnum) {
    this.results[chartKey][countKey][action].amountWon += amountWon;
  }

  incResultsInstances(chartKey: string, countKey: string, action: PlayActionsEnum) {
    // console.log('Instances:', this.results[chartKey][countKey][action].instances + 1);
    this.results[chartKey][countKey][action].instances += 1;
  }

  updateResultsAmountWon(amount: number, countKey: string, action: PlayActionsEnum, chartKey: string, incInstance: boolean) {
    if(!this.results[chartKey][countKey]) {
      this.results[chartKey][countKey] = this.getNewDeviationResultByAction();
    }
    if(incInstance) {
      this.incResultsInstances(chartKey, countKey, action);
    }
    this.incResultsAmountWon(amount, chartKey, countKey, action);
  }

  createLSMasterChartKey(deviationInfo: DeviationInfo): string {
    const { 
      countingMethodTitle, 
      playStrategyTitle, 
      roundingMethod, 
      playerCards, 
      variableConditions
    } = deviationInfo;
    const booleanConditions : string[] = [
      'DAS',
      'DSA',
      'RSA',
      'S17',
      'doubleUpLosesOnHalt',
      'doubleUpLosesOnPush',
      'lateSurrender',
    ];
    // The pieces of the LS key correspond to the following map:
    // countingMethodTitle
    // playStrategyTitle
    // roundingMethod

    // The only variable condition that is not boolean values is:
    // canDoubleOn, it's value will be the 4th section

    // For the remaining variable conditions:
    // DAS 
    // DSA
    // RSA 
    // S17 
    // doubleUpLosesOnHalt 
    // doubleUpLosesOnPush
    // lateSurrender
    // The existence of the condition in the key string indicates the condition is true 
    // while the abscence of the condition indicates the condition is false
    let key: string = `${countingMethodTitle.replaceAll(' ', '-')}_${playStrategyTitle.replaceAll(' ', '-')}_${roundingMethod.replaceAll(' ', '-')}_${variableConditions.canDoubleOn.replaceAll(' ', '-')}`;
    booleanConditions.forEach(c => {
      if(variableConditions[c]) {
        key += `_${c}`
      }
    })
    return key;
  }
}