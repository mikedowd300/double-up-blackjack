import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, take } from 'rxjs';
import { InsuranceDataByPlayer, SimInfo } from '../models-constants-enums/models';
import { PlayerStreakData, TableRecord } from '../history/history-models';

@Injectable({
  providedIn: 'root'
})
export class ViewModelService {

  public showHeader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private nullInfo: SimInfo = { tableSkeleton: null, iterations: null };
  playerHandles: string[] = [];
  private simInfo: SimInfo = this.nullInfo;
  public allowNavigationToDashboard: boolean = false;
  public simData$: BehaviorSubject<TableRecord[]> = new BehaviorSubject<TableRecord[]>(null);
  public insuranceResults$: BehaviorSubject<InsuranceDataByPlayer> = new BehaviorSubject<InsuranceDataByPlayer>(null);
  public tippedAway$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() { }

  public getSimInfo(): SimInfo {
    return this.simInfo;
  }

  public setSimInfo(info: SimInfo): void {
    if(info) {
      this.setAllowNavigationToDashboard(true);
      this.playerHandles = info.tableSkeleton.players?.map(p => p.playerConfigTitle)
    }
    this.simInfo = { ...info };
  }

  public setAllowNavigationToDashboard(allow: boolean): void {
    this.allowNavigationToDashboard = allow;
  }

  public getAllowNavigationToDashboard(): boolean {
    return this.allowNavigationToDashboard;
  }


  public createStreakData(): PlayerStreakData {
    // This transforms all the data of the history into a more managable object with the handles as keys, and just the relevant round info (bankroll, roundId) as data

    const history$ = this.simData$.pipe(filter(x => !!x));
    const streakData = {};
    this.playerHandles.forEach(h => streakData[h] = []);

    history$.pipe(take(1)).subscribe(history => {
      history.forEach(({ players, roundId }) => {
        players.forEach(({ handle, beginningBankroll }) => 
          streakData[handle].push({ beginningBankroll, roundId }))
      });
    })

    return streakData
  }
}