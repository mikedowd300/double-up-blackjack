import { Component, Input, OnDestroy, OnInit} from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { Chart, ChartItem, registerables } from 'chart.js';
import { RouterLink } from '@angular/router';
import { ViewModelService } from '../../../services/view-model.service';
import { PlayerStreakData, StreakDatum } from '../../../history/history-models';

@Component({
  selector: 'break-even-streaks',
  standalone: true,
  imports: [ AsyncPipe, CommonModule , FormsModule, RouterLink],
  templateUrl: './break-even-streaks.component.html',
  styleUrl: './break-even-streaks.component.scss'
})

export class BreakEvenStreaksComponent implements OnInit, OnDestroy {
  @Input() showStreakInfo$: BehaviorSubject<boolean>;

  // streakChart: Chart;
  selectedPlayer$: BehaviorSubject<string>;
  streakData: PlayerStreakData;
  streakLengths: number[] = [100, 500, 1000, 5000, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000];
  streakLengthsResults: { [k: string]: StreakDatum[] } = {};
  playerStreaks: StreakDatum[] = [];
  playerSubStreaks: StreakDatum[] = [];
  endingStreak: StreakDatum;
  longestStreak: number;
  customStreakLength: number = null;
  private destroy$ = new Subject();

  constructor(public vmService: ViewModelService) {}

  ngOnInit(): void {
    this.selectedPlayer$ = new BehaviorSubject<string>(this.vmService.playerHandles[0]);
    this.streakData = this.vmService.createStreakData();
    Chart.register(...registerables);
    this.streakLengths.forEach(val => this.streakLengthsResults[val] = []);
    this.selectedPlayer$.subscribe(handle => this.getPlayerStreaks(handle));
  }

  handleSelectHandle({ target }) {
    this.selectedPlayer$.next(target.value);
  }

  customizeStreakLength() {
    console.log(this.customStreakLength);
  }

  getPlayerStreaks(handle: string) {
    const length: number = this.streakData[handle].length;
    let newStreak: StreakDatum = null;
    this.streakData[handle].forEach(({ beginningBankroll, roundId }) => {
      if(!newStreak) {
        newStreak = { beginningBankroll, roundId, length: 0 };
      } else if(beginningBankroll <= newStreak.beginningBankroll ) {
        newStreak.length++;
      } else if(beginningBankroll >= newStreak.beginningBankroll && newStreak.length === 0 ) {
        newStreak = { beginningBankroll, roundId, length: 0 };
      } else if(beginningBankroll > newStreak.beginningBankroll) {
        newStreak.length++;
        this.playerStreaks.push({ ...newStreak });
        newStreak = { beginningBankroll, roundId, length: 0 };
      }
    });
    this.endingStreak = newStreak;

    this.playerStreaks.forEach(s => {
      this.streakLengths.forEach(sl => {
        if(s.length >= sl) {
          this.streakLengthsResults[sl.toString()].push(s);
        }
      });
    });

    this.longestStreak = Math.max( ...this.playerStreaks.map(s => s.length), this.endingStreak.length )

    console.log(this.playerStreaks);
    console.log(this.streakLengthsResults);
    console.log("Last:", this.endingStreak);
    console.log("Longest:", this.longestStreak);
  }

  viewStreak(dataSubSet: PlayerStreakData) {
    // Create Bankroll Chart with button option to create subStreak data
    // A subset is passed
  }

  createStreak(data: any[]) {
    // this creates viewable results for the data, which may be al data or just a subset, of a single player 
    // NOT SURE IF THIS LIVES HERE
  }

  closeChart() {
    // Closes chart
    // reset relevant data
  }
  
  ngOnDestroy() {
    this.destroy$.next(true);
  }

  // getLabels(data): string[] {
  //   return []
  // }

  // createBankrollChart(data, labels: string[], target: string): Chart {
  //   if(this.streakChart) {
  //     this.streakChart.destroy();
  //   }
  //   const ctx = document.getElementById('myChart');
  //   return new Chart(ctx as ChartItem , {
  //     type: 'line',
  //     data: {
  //       labels: labels,
  //       datasets: [{
  //         label: `${target}'s Break Even Streaks Chart`,
  //         data: data,
  //         borderWidth: 1
  //       }]
  //     },
  //   })
  // }
}

// List Streaks greater than:
//   100
//   500
//   1000
//   5000
//   10000
//   20000
//   30000
//   40000
//   50000
//   Custom

//   with percentage of hands the player is in each of those "break even" streaks ar a longer one

// Show the lenght of the losing streak the session ended on

// Explain that losing streaks within a streak are not counted
// allow user to select a streak to:
//   view the streak's Bankroll chart
//   Evaluate - That streak's streaks

// For any given streak, show (visually, but aslo lexically) the amount of the downswing

// DATA REQUIRED:
// - Array of each player's bankroll from round to round including roundId
