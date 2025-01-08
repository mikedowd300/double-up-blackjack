import { Component, Input, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'bullet-point',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './bullet-point.component.html',
  styleUrl: './bullet-point.component.scss'
})

export class BulletPointComponent implements OnDestroy, OnInit {
  @Input() background: string = 'dark';
  
  private destroy$: Subject<boolean> = new Subject();

  constructor() {}
  
  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}