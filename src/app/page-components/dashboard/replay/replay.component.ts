import { Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ViewModelService } from '../../../services/view-model.service';
import { TableRecord } from '../../../history/history-models';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'replay',
  standalone: true,
  imports: [ CommonModule, RouterLink ],
  templateUrl: './replay.component.html',
  styleUrl: './replay.component.scss',
})

export class ReplayComponent implements OnInit {
  @Input() history: TableRecord[];
  @Input() showReplay$: BehaviorSubject<boolean>;
  @Input() activeRecordIndex: number = 0;

  public maxRound: number;
  public activeRecord: TableRecord;
  public bankrolls: { [k: string]: number } = {};
  public trueCounts: { [k: string]: number } = {};
  public tips: { [k: string]: number } = {};

  constructor(public vmService: ViewModelService) {}

  ngOnInit(): void {
    this.vmService.showHeader$.next(true);
    this.maxRound = this.history.length - 1;
    this.activeRecord = this.history[this.activeRecordIndex];
    this.updateBankrollsAndTrueCounts();
    this.updateTips();
  }

  getNextRound() {
    this.activeRecordIndex += 1;
    this.activeRecord = this.history[this.activeRecordIndex];
    this.updateBankrollsAndTrueCounts();
    this.updateTips();
  }

  getPreviousRound() {
    this.activeRecordIndex -= 1;
    this.activeRecord = this.history[this.activeRecordIndex];
    this.updateBankrollsAndTrueCounts();
    this.updateTips();
  }

  updateBankrollsAndTrueCounts() {
    this.activeRecord.players.forEach(p => this.bankrolls[p.handle] = p.beginningBankroll)
    this.activeRecord.players.forEach(p => this.trueCounts[p.handle] = p.beginningTrueCount)
  }

  updateTips() {
    this.tips = {};
    this.activeRecord.players.forEach(p => this.tips[p.handle] = p.tipped)
  }
}