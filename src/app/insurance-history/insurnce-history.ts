import { InsuranceRecordByCount } from '../models-constants-enums/models';

export class InsuranceHistory {

  insuranceRecord: InsuranceRecordByCount = {}

  constructor(){}

  updateInsuranceRecordByCount(trueCount: string, hasIt: boolean): void {
    if(!this.insuranceRecord[trueCount]) {
      this.insuranceRecord[trueCount] = { instances: 0, hasItCount: 0 };
    }
    this.insuranceRecord[trueCount].instances += 1;
    this.insuranceRecord[trueCount].hasItCount += hasIt ? 1 : 0;
  }

  // createGraphData() {
  //   return 
  // }
}