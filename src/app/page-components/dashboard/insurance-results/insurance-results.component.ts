import { Component, AfterViewInit, Input, OnDestroy, OnInit} from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { Chart, ChartItem, registerables } from 'chart.js';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'insurance-results',
  standalone: true,
  imports: [ AsyncPipe, CommonModule , RouterLink],
  templateUrl: './insurance-results.component.html',
  styleUrl: './insurance-results.component.scss'
})

export class InsuranceResultsComponent implements AfterViewInit, OnDestroy, OnInit {
  @Input() showInsuranceResults$: BehaviorSubject<boolean>;
  @Input() handles: string[];
  @Input() history: any;

  insuranceResultsChart: Chart;
  selectedPlayer$: BehaviorSubject<string>; 
  undateChartRange$: BehaviorSubject<number> = new BehaviorSubject<number>(5);
  playerAndRange$: Observable<any>
  private destroy$ = new Subject();

  constructor() {}

  ngOnInit(): void {
    this.selectedPlayer$ = new BehaviorSubject<string>(this.handles[0]);
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    combineLatest([this.selectedPlayer$, this.undateChartRange$])
      .subscribe(([player, range]) => {
        const labels: string[] = this.getLabels(this.history[player].insuranceRecord, range);
        const insuranceResultsData = this.getInsuranceResultsData(this.history[player].insuranceRecord, labels, player);
        this.insuranceResultsChart = this.createInsuranceResultsChart(insuranceResultsData, labels, player);
      })
  }

  getLabels(data, range): string[] {
    return Object.keys(data)
      .map(l => parseFloat(l))
      .sort((a, b) => a - b)
      .filter(l => {
        const val = parseFloat(l.toString().split(' : ')[0]);
        return (val >= 0) && (val <= range) 
      })
      .map(l => `${this.sanitizeInsuranceCountKey(l.toString())} : ${ data[this.sanitizeInsuranceCountKey(l.toString())].instances }`);
  }

  sanitizeInsuranceCountKey(key: string): string {
    return key.includes('.') ? key : key + '.0';
  }

  getInsuranceResultsData(data, labels, target: string): number[] {
    return labels.map(l => Math.round((data[l.split(' : ')[0]].hasItCount * 10000) / data[l.split(' : ')[0]].instances) / 100)
  }

  createInsuranceResultsChart(data, labels: string[], target: string): Chart {
    if(this.insuranceResultsChart) {
      this.insuranceResultsChart.destroy();
    }
    const ctx = document.getElementById('myChart');
    return new Chart(ctx as ChartItem , {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `${target}'s Total Winning Chart`,
          data: data,
          borderWidth: 1
        }]
      },
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