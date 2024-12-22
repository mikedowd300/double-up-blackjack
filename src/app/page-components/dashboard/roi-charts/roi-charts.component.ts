import { Component, Input, OnDestroy, OnInit} from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, combineLatest, map, Observable, Subject, take } from 'rxjs';
import { SpotRecord, TableRecord } from '../../../history/history-models';
import { Chart, ChartItem, registerables } from 'chart.js';
import { WinningsChartData, WinningsChartDatum } from '../../../models-constants-enums/models';

@Component({
  selector: 'roi-charts',
  standalone: true,
  imports: [ AsyncPipe, CommonModule, RouterLink ],
  templateUrl: './roi-charts.component.html',
  styleUrl: './roi-charts.component.scss',
})

export class RoiChartsComponent implements OnDestroy, OnInit {
  @Input() showRoiChart$: BehaviorSubject<boolean>;
  @Input() handles: string[];
  @Input() history$: Observable<TableRecord[]>;

  totalWinningsByCountChart: Chart;
  averageWinningsByCountChart: Chart;
  roiByCountChart: Chart;
  selectedPlayer$: BehaviorSubject<string>; 
  undateChartRange$: BehaviorSubject<number> = new BehaviorSubject<number>(15);
  winningChartdata$: Observable<WinningsChartData>;
  playerAndRange$: Observable<any>
  private destroy$ = new Subject();

  constructor() {}

  ngOnInit(): void {
    this.selectedPlayer$ = new BehaviorSubject<string>(this.handles[0]);
    
    Chart.register(...registerables);
    this.winningChartdata$ = this.history$.pipe(map((history) => {
      let data: WinningsChartData = {}
      this.handles.forEach(h => data[h] = {});
      history.forEach(record => {
        this.handles.forEach(handle => {
          const playerData = record.players.find(p => p.handle === handle);
          if(playerData) {
            if(!data[playerData?.handle][playerData.beginningTrueCount.toString()]) {
              data[playerData?.handle][playerData.beginningTrueCount.toString()] = { 
                totalBet: 0, 
                totalWon: 0, 
                instances: 0 
              }
            }
            const spots: SpotRecord[] = record.spots.filter(s => !!s).filter(s => s.playerHandle === handle);
            data[playerData.handle][playerData.beginningTrueCount.toString()] = 
            this.updateWinnings(data[playerData.handle][playerData.beginningTrueCount.toString()], spots);
          }
        })
      })
      return data
    }), take(1)),


    combineLatest([this.winningChartdata$, this.selectedPlayer$, this.undateChartRange$])
      .subscribe(([data, player, range]) => {
        const labels: string[] = this.getLabels(data[player], range);
        const totalWinningData = this.getTotalWinningData(data[player], labels, player);
        const averageWinningData = this.getAverageWinningData(data[player], labels, player);
        const roiWinningData = this.getRoiWinningData(data[player], labels, player);
        this.totalWinningsByCountChart = 
        this.createTotalWinningsByCountChart(totalWinningData, labels, player);
        this.averageWinningsByCountChart = 
          this.createAverageWinningsByCountChart(averageWinningData, labels, player);
        this.roiByCountChart = 
          this.createRoiByCountChart(roiWinningData, labels, player);
      })
  }

  updateWinnings(datum: WinningsChartDatum, spots: SpotRecord[]): WinningsChartDatum {
    let totalBet = 0;
    let totalWon = 0;
    spots.forEach(s => s.hands.forEach(h => {
      totalBet += h.betAmount;
      totalWon += h.winnings;
    }))
    return { 
      totalBet: datum.totalBet + totalBet, 
      totalWon: datum.totalWon + totalWon, 
      instances: datum.instances + 1 }
  }

  getLabels(data, range): string[] {
    return Object.keys(data)
      .map(l => parseInt(l))
      .sort((a, b) => a - b)
      .filter(x => (x >= (-1) * range) && (x <= range))
      .map(l => `${l.toString()} : ${ data[l.toString()].instances }`);
  }

  getTotalWinningData(data, labels, target: string): number[] {
    return labels.map(l => data[l.split(' : ')[0]].totalWon)
  }

  getAverageWinningData(data, labels, target: string): number[] {
    return labels.map(l => data[l.split(' : ')[0]].totalWon / data[l.split(' : ')[0]].instances)
  }

  getRoiWinningData(data, labels, target: string): number[] {
    return labels.map(l => Math.round((data[l.split(' : ')[0]].totalWon * 1000 / data[l.split(' : ')[0]].totalBet)) / 10)
  }

  createTotalWinningsByCountChart(data, labels: string[], target: string): Chart {
    if(this.totalWinningsByCountChart) {
      this.totalWinningsByCountChart.destroy();
    }
    const ctx = document.getElementById('total-winnings-chart');

    return new Chart(ctx as ChartItem , {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: `${target}'s Total Winning Chart`,
          data: data,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          x: { 
            grid: { 
              drawOnChartArea: false 
            } 
          },
          y: {
            beginAtZero: false,
            grid: { 
              drawOnChartArea: false 
            }
          }
        }
      }
    })
  }

  createAverageWinningsByCountChart(data, labels: string[], target: string): Chart {
    if(this.averageWinningsByCountChart) {
      this.averageWinningsByCountChart.destroy();
    }
    const ctx = document.getElementById('average-winnings-chart');

    return new Chart(ctx as ChartItem , {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: `${target}'s Average Winning Chart`,
          data: data,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          x: { 
            grid: { 
              drawOnChartArea: false 
            } 
          },
          y: {
            beginAtZero: false,
            grid: { 
              drawOnChartArea: false 
            }
          }
        }
      }
    })
  }

  createRoiByCountChart(data, labels: string[], target: string): Chart {
    if(this.roiByCountChart) {
      this.roiByCountChart.destroy();
    }
    const ctx = document.getElementById('roi-chart');

    return new Chart(ctx as ChartItem , {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: `${target}'s Roi Chart`,
          data: data,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          x: { 
            grid: { 
              drawOnChartArea: false 
            } 
          },
          y: {
            beginAtZero: false,
            grid: { 
              drawOnChartArea: false 
            }
          }
        }
      }
    })
  }

  handleSelectHandle({ target }) {
    this.selectedPlayer$.next(target.value);
  }

  updateChartRange({ target }) {
    this.undateChartRange$.next(target.value);
  }
  
  ngOnDestroy() {
    this.destroy$.next(true);
  }
}